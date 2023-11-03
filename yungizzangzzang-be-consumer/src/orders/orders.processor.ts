import { OnQueueActive, OnQueueEvent, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { OrderItemsRepository } from 'src/order-items/order-items.repository';
import { OrdersRepository } from './orders.repository';

@Processor('orders')
export class OrdersProcessor {
constructor(
private readonly ordersRepository: OrdersRepository,
private readonly orderItemsRepository: OrderItemsRepository,
) {}

@Process('create')
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
