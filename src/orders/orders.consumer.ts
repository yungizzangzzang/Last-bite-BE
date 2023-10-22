import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { OrdersService } from './orders.service';

@Processor('ordersQueue')
export class OrdersQueueConsumer {
  constructor(private readonly ordersService: OrdersService) {}

  // 큐에 job이 추가되면 이를 감지하고,
  // 큐에 쌓인 job들을 FIFO로 가져와서 sendRequest() 함수에 전달
  @Process('addToOrdersQueue')
  async handleAddToOrdersQueue(job: Job): Promise<boolean> {
    console.log('*1 handleAddOrdersQueue 전입');
    console.log(`${job.data} 작업 수행 중`);

    // 비즈니스 로직을 수행하는 메소드에 job 전달
    return await this.ordersService.sendRequest(
      job.data.orderId,
      job.data.itemId,
      job.data.eventName,
      job.data.userId,
    );
  }
}