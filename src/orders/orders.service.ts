import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Queue } from 'bull';
import { ItemsRepository } from 'src/items/items.repository';
import { OrderItemsRepository } from 'src/order-items/order-items.repository';
import { CreateOrderOrderItemDto } from './dto/create-order.dto';
import { OneOrderDTO } from './dto/get-one-order.dto';
import { UserOrdersDTO } from './dto/get-user-orders.dto';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(
    @InjectQueue('orders') private ordersQueue: Queue, // bullqueue DI
    private readonly ordersRepository: OrdersRepository,
    private readonly orderItemsRepository: OrderItemsRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly itemsRepository: ItemsRepository,
  ) {}

  async createOrder(
    createOrderOrderItemDto: CreateOrderOrderItemDto,
    userId: number,
  ) {
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
