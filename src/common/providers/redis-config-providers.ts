import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redisCachesStore from 'cache-manager-ioredis';

@Injectable()
export class RedisConfigProvider implements CacheOptionsFactory {
  constructor(private configService: ConfigService) {}

  createCacheOptions():
    | CacheModuleOptions<Record<string, any>>
    | Promise<CacheModuleOptions<Record<string, any>>> {
    return {
      store: redisCachesStore,
      host: this.configService.get('REDIS_HOST'),
      port: this.configService.get('REDIS_PORT'),
      ttl: this.configService.get('REDIS_TTL'),
      username: this.configService.get('REDIS_USERNAME'),
      password: this.configService.get('REDIS_PASSWORD'),
    };
  }
}
