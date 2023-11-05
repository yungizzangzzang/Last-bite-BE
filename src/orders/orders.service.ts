import { InjectQueue } from '@nestjs/bull';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Queue } from 'bull';
import { Redis } from 'ioredis';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderOrderItemDto } from './dto/create-order.dto';
import { OneOrderDTO } from './dto/get-one-order.dto';
import { UserOrdersDTO } from './dto/get-user-orders.dto';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  private readonly userRedis: Redis;
  private readonly itemRedis: Redis;
  private readonly storeRedis: Redis;

  constructor(
    @InjectQueue('orders') private ordersQueue: Queue,
    private readonly ordersRepository: OrdersRepository,
    private readonly prisma: PrismaService,
  ) {
    this.userRedis = new Redis({
      port: 7001,
      host: process.env.REDIS_HOST,
    });
    this.itemRedis = new Redis({
      port: 7002,
      host: process.env.REDIS_HOST,
    });
    this.storeRedis = new Redis({
      port: 7003,
      host: process.env.REDIS_HOST,
    });

    this.userRedis.on('error', (err) => {
      console.error('Redis error:', err);
    });
    this.itemRedis.on('error', (err) => {
      console.error('Redis error:', err);
    });
    this.storeRedis.on('error', (err) => {
      console.error('Redis error:', err);
    });
  }

  async updateRedisUserPoint(
    userId: number,
    totalPrice: number,
  ): Promise<number> {
    // userId로 redis에서 포인트 조회
    const getRedisPoint = await this.userRedis.get(userId.toString());

    let redisPoint = getRedisPoint ? +getRedisPoint : -1;
    // redis에 user 정보 없을 때 DB 조회
    if (redisPoint === -1) {
      const user = await this.prisma.users.findUnique({
        where: { userId },
        select: { point: true },
      });

      // user 및 user.point 정보 없을 때
      if (!user || !user.point) {
        throw new HttpException(
          { message: '사용자 정보를 확인할 수 없습니다.' },
          HttpStatus.BAD_REQUEST,
        );
      }

      // DB에서 조회한 user 정보(point) redis에 넣기
      const userPoint = user.point;

      await this.userRedis.set(userId.toString(), userPoint.toString());
      redisPoint = userPoint;
    }

    // redisPoint < totalPrice
    if (redisPoint < totalPrice) {
      throw new HttpException(
        { message: '포인트를 충전해주세요.' },
        HttpStatus.BAD_REQUEST,
      );
    }

    // redis point 차감 (point - totalPrice)
    await this.userRedis.decrby(userId.toString(), totalPrice);

    return redisPoint - totalPrice;
  }

  // 아이템 수량 감소 처리 함수
  async updateItemCount(itemId: number, countToDeduct: number): Promise<void> {
    let itemCount = await this.itemRedis.get(itemId.toString());

    if (itemCount === null) {
      // Redis에서 값을 찾을 수 없다면, 데이터베이스에서 조회
      const itemRecord = await this.prisma.items.findUnique({
        where: { itemId },
        select: { count: true },
      });

      if (!itemRecord || itemRecord.count === null) {
        throw new BadRequestException('아이템의 수량 정보를 찾을 수 없습니다.');
      }

      itemCount = itemRecord.count.toString();
      await this.itemRedis.set(itemId.toString(), itemCount);
    }

    if (parseInt(itemCount) < countToDeduct) {
      throw new BadRequestException('아이템의 수량이 부족합니다.');
    }

    // 감소된 수량으로 Redis 값을 업데이트
    await this.itemRedis.decrby(itemId.toString(), countToDeduct);
  }

  async validateStoreExistence(storeId: number): Promise<void> {
    let storeExists = await this.storeRedis.get(storeId.toString());

    if (storeExists === null) {
      const storeRecord = await this.prisma.stores.findUnique({
        where: { storeId },
        select: { storeId: true },
      });

      storeExists = storeRecord ? '1' : '0';
      await this.storeRedis.set(storeId.toString(), storeExists);
    }

    if (storeExists === '0') {
      throw new NotFoundException('해당 가게를 찾을 수 없습니다.');
    }
  }

  async createOrder(
    createOrderOrderItemDto: CreateOrderOrderItemDto,
    userId: number,
  ) {
    try {
      // 스토어 존재 여부 검증
      await this.validateStoreExistence(createOrderOrderItemDto.storeId);

      const redisUserPoint = await this.updateRedisUserPoint(
        userId,
        createOrderOrderItemDto.totalPrice,
      );

      // 포인트 감소 처리 결과를 큐에 job으로 추가
      await this.ordersQueue.add('updateUserPoint', {
        userId: userId,
        remainUserPoint: redisUserPoint,
      });

      // 아이템 수량 감소 처리
      const updateItemsResults: { itemId: number; count: number }[] = [];
      for (const item of createOrderOrderItemDto.items) {
        await this.updateItemCount(item.itemId, item.count);
        updateItemsResults.push({ itemId: item.itemId, count: item.count });
      }

      // 아이템 수량 감소 처리 결과를 큐에 job으로 추가
      await this.ordersQueue.add('updateItemCount', {
        items: updateItemsResults,
      });

      // Order, OrderItem 생성하는 job을 큐에 추가
      await this.ordersQueue.add('create', {
        createOrderOrderItemDto,
        userId,
      });

      return;
    } catch (error) {
      console.error(error);
    }
  }

  async getUserOrders(userId: number) {
    const result: UserOrdersDTO[] = await this.ordersRepository.getUserOrders(
      userId,
    );
    return result;
  }

  async getOneOrder(orderId: number) {
    const result: OneOrderDTO = await this.ordersRepository.getOneOrder(
      orderId,
    );
    return result;
  }
}
