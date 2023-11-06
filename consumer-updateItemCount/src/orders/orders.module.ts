import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UpdateItemCountStreamConsumer } from './orders.consumer';

@Module({
  imports: [PrismaModule],
  providers: [UpdateItemCountStreamConsumer],
  exports: [],
})
export class OrdersModule {}
