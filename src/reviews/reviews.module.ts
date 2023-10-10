import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/users/auth/auth.module';
import { ReviewsController } from './reviews.controller';
import { ReviewsRepository } from './reviews.reopository';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewsRepository],
})
export class ReviewsModule {}
