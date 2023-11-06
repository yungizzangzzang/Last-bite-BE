import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UpdateUserPointsStreamConsumer } from './orders.consumer';

@Module({
  imports: [PrismaModule],
  providers: [UpdateUserPointsStreamConsumer],
  exports: [],
})
export class OrdersModule {}
