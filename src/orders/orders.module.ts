import { Module } from '@nestjs/common';
import { ItemsModule } from 'src/items/items.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { OrderItemsModule } from 'src/order-items/order-items.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { OrdersService } from './orders.service';

@Module({
  imports: [PrismaModule, OrderItemsModule, ItemsModule, JobsModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
