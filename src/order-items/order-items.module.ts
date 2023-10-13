import { Module } from '@nestjs/common';
import { OrderItemsController } from './order-items.controller';
import { OrderItemsRepository } from './order-items.repository';
import { OrderItemsService } from './order-items.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OrderItemsController],
  providers: [OrderItemsService,OrderItemsRepository],
  exports: [OrderItemsRepository],
})
export class OrderItemsModule {}
