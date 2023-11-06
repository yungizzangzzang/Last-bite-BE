import { Module } from '@nestjs/common';
import { ItemsModule } from 'src/items/items.module';
import { OrderItemsModule } from 'src/order-items/order-items.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from 'src/users/auth/auth.service';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { OrdersService } from './orders.service';

@Module({
  imports: [PrismaModule, OrderItemsModule, ItemsModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository, AuthService],
  exports: [OrdersRepository, OrdersService],
})
export class OrdersModule {}
