import { OnQueueActive, OnQueueEvent, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { OrderItemsRepository } from 'src/order-items/order-items.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrdersRepository } from './orders.repository';

@Processor('orders')
export class OrdersProcessor {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly orderItemsRepository: OrderItemsRepository,
    private readonly prisma: PrismaService,
  ) {}

  @Process('create')
  async handleCreateOrder(job: Job<any>) {
    const { createOrderOrderItemDto, userId, redisUserPoint } = job.data;

    const order = await this.ordersRepository.createOrder(
      createOrderOrderItemDto,
      userId,
      redisUserPoint,
    );

    await this.orderItemsRepository.createOrderItem(
      order.orderId,
      createOrderOrderItemDto.items,
    );

    return {};
  }

  @Process('updateItemCount')
  async handleUpdateItemCount(
    job: Job<{ items: { itemId: number; count: number }[] }>,
  ) {
    const updatePromises = job.data.items.map((item) =>
      this.prisma.items.update({
        where: { itemId: item.itemId },
        data: {
          count: {
            decrement: item.count,
          },
        },
      }),
    );

    await Promise.all(updatePromises);
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
