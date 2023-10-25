import {
  BullRootModuleOptions,
  SharedBullConfigurationFactory,
} from '@nestjs/bull';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BullConfigProvider implements SharedBullConfigurationFactory {
  createSharedConfiguration(): BullRootModuleOptions {
    return {
      redis: {
        maxRetriesPerRequest: 20,
        host: process.env.REDIS_HOST,
        port: 6379,
      },
    };
  }
}
