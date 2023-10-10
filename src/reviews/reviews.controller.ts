import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { User } from 'src/common/decorators/user.decorator';
import { ResponseReviewDto } from './dto/response-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post(':storeId')
  async createReview(
    @User() user,
    @Param('storeId') storeId: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    const userId = user.userId;

    const result: { message: string } = await this.reviewsService.createReview(
      userId,
      +storeId,
      createReviewDto,
    );

    return result;
  }

  @Get(':storeId')
  async getStoreReview(@Param('storeId') storeId: string) {
    const result: ResponseReviewDto[] =
      await this.reviewsService.getStoreReview(+storeId);

    return result;
  }
}
