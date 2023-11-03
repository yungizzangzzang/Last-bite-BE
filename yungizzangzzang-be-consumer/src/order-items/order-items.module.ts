import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OrderItemsRepository } from './order-items.repository';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [OrderItemsRepository],
  exports: [OrderItemsRepository],
})
export class OrderItemsModule {}
