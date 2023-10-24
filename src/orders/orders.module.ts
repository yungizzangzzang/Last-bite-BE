import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Queue } from 'bull';
import { BullConfigProvider } from 'src/common/providers/bull-config.provider';
import { RedisConfigProvider } from 'src/common/providers/redis-config-providers';
import { ItemsModule } from 'src/items/items.module';
import { OrderItemsModule } from 'src/order-items/order-items.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StoreEntity } from 'src/stores/entities/stores.entity';
import { AuthService } from 'src/users/auth/auth.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { OrdersQueueConsumer } from './orders.consumer';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    PrismaModule,
    OrderItemsModule,
    ItemsModule,
    BullModule.forRootAsync('bullqueue-config', {
      useClass: BullConfigProvider,
    }),
    BullModule.registerQueue({
      configKey: 'bullqueue-config',
      name: 'ordersQueue',
    }),
    CacheModule.registerAsync({
      useClass: RedisConfigProvider,
    }),
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrdersRepository,
    OrdersQueueConsumer,
    EventEmitter2,
    AuthService,
    StoreEntity,
    UserEntity,
  ],
  exports: [OrdersRepository],
})
export class OrdersModule {
  // bull-board UI 연결을 위한 설정
  constructor(@InjectQueue('ordersQueue') private ordersQueue: Queue) {}

  configure(consumer: MiddlewareConsumer) {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/queues-board');

    createBullBoard({
      queues: [new BullAdapter(this.ordersQueue)],
      serverAdapter,
    });

    consumer.apply(serverAdapter.getRouter()).forRoutes('/queues-board');
  }
}
