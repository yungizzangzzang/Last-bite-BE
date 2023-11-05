import { Process, Processor } from '@nestjs/bull';
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

  @Process({ name: 'create', concurrency: 5 })
  async handleCreateOrder(job: Job<any>) {
    const { createOrderOrderItemDto, userId } = job.data;

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

  @Process({ name: 'updateItemCount', concurrency: 5 })
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

  @Process({ name: 'updateUserPoint', concurrency: 5 })
  async handleUpdateUserPoint(
    job: Job<{ userId: number; remainUserPoint: number }>,
  ): Promise<void> {
    const { userId, remainUserPoint } = job.data;

    await this.prisma.users.update({
      where: { userId },
      data: {
        point: remainUserPoint,
      },
    });
  }
}
