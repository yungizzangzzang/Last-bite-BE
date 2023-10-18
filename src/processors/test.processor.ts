import { OnQueueEvent, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('testQueue')
export class TestProcessor {
  @Process('testJob')
  handleTranscode(job: Job<{ name: string }>): Promise<void> {
    console.log(`${job.id}번 작업: ${job.data.name}`);
    return Promise.resolve();
  }

  @OnQueueEvent('completed')
  onCompleted(job: Job): void {
    console.log(`${job.id}번 작업: ${job.name} 완료.`);
  }

  @OnQueueEvent('failed')
  onFailed(job: Job): void {
    console.error(`${job.id}번 작업: ${job.name} 실패`);
  }
}
