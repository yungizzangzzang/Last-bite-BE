import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class JobsService {
  constructor(@InjectQueue('testQueue') private readonly queue: Queue) {}

  async addJob(name: string): Promise<void> {
    console.log(name);
    await this.queue.add('testJob', { name });
  }
}
