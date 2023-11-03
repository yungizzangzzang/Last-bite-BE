import { OnQueueActive, OnQueueEvent, Process, Processor } from '@nestjs/bull';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Job } from 'bull';
import { ItemsRepository } from 'src/items/items.repository';
import { OrderItemsRepository } from 'src/order-items/order-items.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrdersRepository } from './orders.repository';

@Processor('orders')
export class OrdersProcessor {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly orderItemsRepository: OrderItemsRepository,
    private readonly itemsRepository: ItemsRepository,
    private readonly prisma: PrismaService,
  ) {}

  @Process('create')
  async handleCreateOrder(job: Job<any>) {
    const { createOrderOrderItemDto, userId } = job.data;

    const orderItems = createOrderOrderItemDto.items;

    const findItem = orderItems.map((orderItems) =>
      this.itemsRepository.getOneItemByOrder(orderItems.itemId),
    );

    const items = await Promise.all(findItem);

    // 아이템(핫딜)의 storeId(가게정보)와 입력된 storeId가 다른 경우
    for (let i = 0; i < items.length; i++) {
      if (items[i].storeId !== createOrderOrderItemDto.storeId) {
        throw new HttpException(
          { message: '가게 정보가 올바르지 않습니다.' },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const filteredResults: string[] | undefined = [];

    for (let i = 0; i < items.length; i++) {
      if (orderItems[i].count > items[i].count) {
        filteredResults.push(
          `${items[i].name}의 주문 가능 수량은 ${items[i].count}개 입니다.`,
        );
      }
    }

    if (filteredResults.length > 0) {
      throw new HttpException(
        { message: filteredResults },
        HttpStatus.BAD_REQUEST,
      );
    }

    const createOrder = await this.ordersRepository.createOrder(
      createOrderOrderItemDto,
      userId,
      items,
    );
    
    await this.orderItemsRepository.createOrderItem(
      createOrder.orderId,
      createOrderOrderItemDto.items,
    );

    return {};
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(`${job.id}`);
  }

  @OnQueueEvent('completed')
  onCompleted(job: Job<any>) {
    console.log(`${job.id}`);
  }

  @OnQueueEvent('error')
  onError(job: Job<any>, error: any) {
    console.error(error);
    console.log(job);
    console.log(`${job.id}번 작업이 실패했습니다. ${error}`);
  }
}
