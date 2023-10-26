import {
  BullRootModuleOptions,
  SharedBullConfigurationFactory,
} from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BullConfigProvider implements SharedBullConfigurationFactory {
  constructor(private configService: ConfigService) {}

  createSharedConfiguration(): BullRootModuleOptions {
    return {
      redis: {
        maxRetriesPerRequest: 20,
        host: this.configService.get('REDISL_HOST'),
        port: this.configService.get('REDISL_PORT'),
      },
    };
  }
}
