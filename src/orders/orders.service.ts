import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Redis } from 'ioredis';
import { ItemsRepository } from 'src/items/items.repository';
import { StoresRepository } from 'src/stores/stores.repository';
import { AuthService } from 'src/users/auth/auth.service';
import { CreateOrderOrderItemDto } from './dto/create-order.dto';
import { OneOrderDTO } from './dto/get-one-order.dto';
import { UserOrdersDTO } from './dto/get-user-orders.dto';
import { OrdersRepository } from './orders.repository';

interface AggregatedItems {
  [key: string]: number;
}

interface ItemUpdate {
  itemId: string;
  count: number;
  version: number;
}

@Injectable()
export class OrdersService {
  private readonly userRedis: Redis;
  private readonly itemRedis: Redis;
  private readonly storeRedis: Redis;
  private readonly createOrderStream: Redis;
  private readonly updateItemStream: Redis;
  private readonly updateUserPointStream: Redis;

  private createRedisClient(port: number): Redis {
    const client = new Redis({ port, host: process.env.REDIS_HOST });
    client.on('error', (err) => {
      console.error(`Redis error on port ${port}:`, err);
    });
    return client;
  }
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly storesRepository: StoresRepository,
    private readonly authService: AuthService,
    private readonly itemsRepository: ItemsRepository,
  ) {
    this.userRedis = this.createRedisClient(7001);
    this.itemRedis = this.createRedisClient(7002);
    this.storeRedis = this.createRedisClient(7003);
    this.createOrderStream = this.createRedisClient(7004);
    this.updateItemStream = this.createRedisClient(7005);
    this.updateUserPointStream = this.createRedisClient(7006);
  }

  async validateStoreExistence(storeId: number): Promise<void> {
    let storeExists = await this.storeRedis.get(storeId.toString());

    if (storeExists === null) {
      const storeRecord = await this.storesRepository.selectOneStore(storeId);

      storeExists = storeRecord ? '1' : '0';
      await this.storeRedis.set(storeId.toString(), storeExists, 'EX', 120);
    }

    if (storeExists === '0') {
      throw new NotFoundException('해당 가게를 찾을 수 없습니다.');
    }
  }

  async createOrder(
    createOrderOrderItemDto: CreateOrderOrderItemDto,
    userId: number,
  ) {
    const redisMulti = this.userRedis.multi();

    try {
      // 스토어 존재 여부 검증
      await this.validateStoreExistence(createOrderOrderItemDto.storeId);

      // 유저 포인트 감소 및 버전++
      let userVersion = 0;
      const userKey = userId.toString();
      const getRedisPoint = await this.userRedis.hgetall(userKey);
      let redisPoint =
        getRedisPoint && getRedisPoint.point
          ? parseInt(getRedisPoint.point)
          : -1;

      if (redisPoint === -1) {
        const user = await this.authService.findOneUserWithPointAndVersion(
          userId,
        );

        if (!user || user.point === null) {
          throw new BadRequestException('사용자 정보를 확인할 수 없습니다.');
        }

        userVersion = user.version ?? 0;
        redisPoint = user.point;

        await this.userRedis.hmset(
          userKey,
          'point',
          redisPoint.toString(),
          'version',
          userVersion.toString(),
          'EX',
          60 * 60 * 12,
        );
      } else {
        const redisVersion = await this.userRedis.hget(userKey, 'version');
        userVersion = parseInt(redisVersion ?? '0');

        if (isNaN(userVersion)) {
          throw new InternalServerErrorException(
            '사용자 버전 정보를 확인할 수 없습니다.',
          );
        }
      }

      if (redisPoint < createOrderOrderItemDto.totalPrice) {
        throw new BadRequestException('포인트를 충전해주세요.');
      }

      redisMulti.hincrby(userKey, 'point', -createOrderOrderItemDto.totalPrice);
      userVersion++;
      redisMulti.hset(userKey, 'version', userVersion.toString());
      const newPoint = redisPoint - createOrderOrderItemDto.totalPrice;

      // 아이템 수량 집계 및 중복 제거
      const aggregatedItems: AggregatedItems =
        createOrderOrderItemDto.items.reduce((acc: AggregatedItems, item) => {
          acc[item.itemId] = (acc[item.itemId] || 0) + item.count;
          return acc;
        }, {});

      // 아이템 수량 감소 및 버전 ++
      const itemUpdates: ItemUpdate[] = [];
      for (const [itemId, totalQuantity] of Object.entries(aggregatedItems)) {
        let version = 0;
        const itemIdString = itemId.toString();

        const getRedisItemData = await this.itemRedis.hgetall(itemIdString);
        let itemCount =
          getRedisItemData && getRedisItemData.count
            ? parseInt(getRedisItemData.count)
            : -1;

        if (itemCount === -1) {
          const itemRecord = await this.itemsRepository.getOneItem(
            Number(itemId),
          );

          if (!itemRecord || itemRecord.count === null) {
            throw new BadRequestException(
              '아이템의 수량 정보를 찾을 수 없습니다.',
            );
          }

          version = itemRecord.version ?? 0;
          itemCount = itemRecord.count;

          await this.itemRedis.hmset(
            itemIdString,
            'count',
            itemCount.toString(),
            'version',
            version.toString(),
            'EX',
            60 * 60 * 12,
          );
        } else {
          version = parseInt(getRedisItemData.version ?? '0');
        }

        if (itemCount < totalQuantity) {
          throw new BadRequestException('아이템의 수량이 부족합니다.');
        }

        redisMulti.hincrby(itemIdString, 'count', -totalQuantity);
        itemUpdates.push({
          itemId: itemId,
          count: totalQuantity,
          version: version + 1,
        });
      }

      const results = await redisMulti.exec();
      if (results === null) {
        throw new InternalServerErrorException(
          '트랜잭션 처리 중 오류가 발생했습니다.',
        );
      }

      // 포인트 감소 처리 결과를 스트림에 추가
      await this.updateUserPointStream.xadd(
        'updateUserPointStream',
        '*',
        'userId',
        userId.toString(),
        'remainUserPoint',
        newPoint.toString(),
        'version',
        userVersion.toString(),
      );

      // 아이템 개수 감소 처리 결과를 스트림에 추가
      for (const update of itemUpdates) {
        await this.itemRedis.hset(
          update.itemId.toString(),
          'version',
          update.version.toString(),
          'EX',
          60 * 60 * 12,
        );
        await this.updateItemStream.xadd(
          'updateItemCountStream',
          '*',
          'itemId',
          update.itemId,
          'count',
          update.count.toString(),
          'version',
          update.version.toString(),
        );
      }

      // Order, OrderItem 생성하는 정보를 스트림에 추가
      await this.createOrderStream.xadd(
        'createOrderStream',
        '*',
        'userId',
        userId.toString(),
        'details',
        JSON.stringify(createOrderOrderItemDto),
      );

      return { message: '주문에 성공하였습니다.' };
    } catch (error) {
      console.error(error);
      throw error;
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
