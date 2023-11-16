import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CreateOrderStreamConsumer } from './orders.consumer';

@Module({
  imports: [PrismaModule],
  providers: [CreateOrderStreamConsumer],
  exports: [],
})
export class OrdersModule {}
