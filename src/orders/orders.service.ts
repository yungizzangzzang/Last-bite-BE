import { InjectQueue } from '@nestjs/bull';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
  constructor(
    @InjectQueue('orders') private ordersQueue: Queue, // bullqueue DI
    private readonly ordersRepository: OrdersRepository,
    private readonly prisma: PrismaService,
  ) {
    this.userRedis = new Redis({
      port: 7001,
      host: 'localhost',
    });
  }

  async updateRedisUserPoint(
    userId: number,
    totalPrice: number,
  ): Promise<number> {
    // userId로 redis에서 포인트 조회
    let getRedisPoint = await this.userRedis.get(userId.toString());

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

  async createOrder(
    createOrderOrderItemDto: CreateOrderOrderItemDto,
    userId: number,
  ) {
    try {
      const redisUserPoint = await this.updateRedisUserPoint(
        userId,
        createOrderOrderItemDto.totalPrice,
      );

      const result = await this.ordersQueue.add('create', {
        createOrderOrderItemDto,
        userId,
        redisUserPoint,
      });

      return { result };
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
  // bullqueue UI dashboard를 위한 메소드
  getRequestQueueForBoard(): Queue {
    return this.ordersQueue;
  }
}

//
