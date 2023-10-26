import { OnQueueActive, OnQueueEvent, Process, Processor } from '@nestjs/bull';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Job } from 'bull';
import { ItemsRepository } from 'src/items/items.repository';
import { OrderItemsRepository } from 'src/order-items/order-items.repository';
import { OrdersRepository } from './orders.repository';

@Processor('orders')
export class OrdersProcessor {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly orderItemsRepository: OrderItemsRepository,
    private readonly itemsRepository: ItemsRepository,
  ) {}

  @Process('create')
  async handleCreateOrder(job: Job<any>) {
    const { createOrderOrderItemDto, userId } = job.data;
    const results: (string | undefined)[] = await Promise.all(
      createOrderOrderItemDto.items.map(async (orderItem) => {
        const itemId = orderItem.itemId;
        const item = await this.itemsRepository.getOneItem(itemId);

        // Items.count < OrderItems.count 일때 주문 불가
        if (orderItem.count > item.count) {
          return `${item.name}의 주문 가능 수량은 ${item.count}개 입니다.`;
        }
      }),
    );

    // if 문 true 일 때 반환되는 undefined 제거
    const filteredResults = results.filter((result) => result !== undefined);

    // 에러 메세지 반환
    if (filteredResults.length > 0) {
      throw new HttpException(
        { message: filteredResults },
        HttpStatus.BAD_REQUEST,
      );
    }

    const order = await this.ordersRepository.createOrder(
      createOrderOrderItemDto,
      userId,
    );

    await this.orderItemsRepository.createOrderItem(
      order.orderId,
      createOrderOrderItemDto.items,
    );

    return {};
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(`${job.id} 번 작업 시작`);
  }

  @OnQueueEvent('completed')
  onCompleted(job: Job<any>) {
    console.log(`${job.id}번 작업 완료`);
  }

  @OnQueueEvent('error')
  onError(job: Job<any>, error: any) {
    console.error(error);
    console.log(job);
    console.log(`${job.id}번 작업이 실패했습니다. ${error}`);
  }
}
