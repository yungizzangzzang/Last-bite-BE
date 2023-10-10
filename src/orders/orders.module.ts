import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { OrdersService } from './orders.service';

@Module({
  imports: [PrismaModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
