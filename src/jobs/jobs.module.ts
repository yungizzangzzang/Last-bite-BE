import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TestProcessor } from 'src/processors/test.processor';
import { JobsService } from './jobs.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'testQueue',
    }),
  ],
  providers: [JobsService, TestProcessor],
  exports: [JobsService],
})
export class JobsModule {}
