import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BullConfigProvider } from 'src/common/providers/bull-config.provider';
import { ItemsModule } from 'src/items/items.module';
import { OrderItemsModule } from 'src/order-items/order-items.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from 'src/users/auth/auth.service';
import { OrdersProcessor } from './orders.processor';
import { OrdersRepository } from './orders.repository';

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
      name: 'orders',
    }),
  ],
  providers: [OrdersRepository, EventEmitter2, AuthService, OrdersProcessor],
  exports: [OrdersRepository, OrdersProcessor],
})
export class OrdersModule {}
