import { InjectQueue } from '@nestjs/bull';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Queue } from 'bull';
import { ItemsRepository } from 'src/items/items.repository';
import { OrderItemsRepository } from 'src/order-items/order-items.repository';
import { StoresRepository } from 'src/stores/stores.repository';
import { CreateOrderOrderItemDto } from './dto/create-order.dto';
import { OneOrderDTO } from './dto/get-one-order.dto';
import { UserOrdersDTO } from './dto/get-user-orders.dto';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(
    @InjectQueue('orders') private ordersQueue: Queue, // bullqueue DI
    private readonly ordersRepository: OrdersRepository,
    private readonly storesRepository: StoresRepository,
    private readonly orderItemsRepository: OrderItemsRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly itemsRepository: ItemsRepository,
  ) {}

  async createOrder(
    createOrderOrderItemDto: CreateOrderOrderItemDto,
    userId: number,
  ) {
    const store = await this.storesRepository.getOneStoreById(
      createOrderOrderItemDto.storeId,
    );

    // storeId에 해당하는 Stores 없는 경우
    if (!store) {
      throw new HttpException(
        { message: '가게 정보가 존재하지 않습니다.' },
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      const result = await this.ordersQueue.add('create', {
        createOrderOrderItemDto,
        userId,
      });
      return result;
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
