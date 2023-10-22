import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import * as redisCachesStore from 'cache-manager-ioredis';

@Injectable()
export class RedisConfigProvider implements CacheOptionsFactory {
  createCacheOptions():
    | CacheModuleOptions<Record<string, any>>
    | Promise<CacheModuleOptions<Record<string, any>>> {
    return {
      store: redisCachesStore,
      host: process.env.REDIS_HOST,
      port: 6379,
    };
  }
}
