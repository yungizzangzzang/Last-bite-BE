import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UpdateUserPointStreamConsumer } from './orders.consumer';

@Module({
  imports: [PrismaModule],
  providers: [UpdateUserPointStreamConsumer],
  exports: [],
})
export class OrdersModule {}
