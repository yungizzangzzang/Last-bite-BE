import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ReviewsController } from './reviews.controller';
import { ReviewsRepository } from './reviews.reopository';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [PrismaModule],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewsRepository],
})
export class ReviewsModule {}
