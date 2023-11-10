import { Module } from '@nestjs/common';
import { ItemsModule } from 'src/items/items.module';
import { OrderItemsModule } from 'src/order-items/order-items.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StoresModule } from 'src/stores/stores.module';
import { AuthModule } from 'src/users/auth/auth.module';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    PrismaModule,
    OrderItemsModule,
    ItemsModule,
    StoresModule,
    AuthModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
  exports: [OrdersRepository, OrdersService],
})
export class OrdersModule {}
