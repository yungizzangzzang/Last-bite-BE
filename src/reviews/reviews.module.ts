import { Module } from '@nestjs/common';
import { OrdersModule } from 'src/orders/orders.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StoresModule } from 'src/stores/stores.module';
import { AuthModule } from 'src/users/auth/auth.module';
import { ReviewsController } from './reviews.controller';
import { ReviewsRepository } from './reviews.repository';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [PrismaModule, AuthModule, OrdersModule, StoresModule],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewsRepository],
})
export class ReviewsModule {}
