import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { CreateReviewDto } from './dto/create-review.dto';
import { ResponseReviewDto } from './dto/response-review.dto';
import { ReviewsService } from './reviews.service';

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
