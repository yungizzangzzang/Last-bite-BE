import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Users } from '@prisma/client';
import { User } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/users/guards/jwt.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { ResponseReviewDto } from './dto/response-review.dto';
import { ReviewsService } from './reviews.service';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('/:orderId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '리뷰 생성' })
  @ApiCreatedResponse({ description: '리뷰 생성 성공' })
  @ApiBadRequestResponse({ description: '리뷰 본문이 없습니다.' })
  async createReview(
    @User() user: Users,
    @Param('orderId') orderId: string,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<{ message: string }> {
    const userId = user.userId;
    const result: { message: string } = await this.reviewsService.createReview(
      userId,
      +orderId,
      createReviewDto,
    );

    return result;
  }

  @Get('/:storeId')
  @ApiOperation({ summary: '가게 리뷰 조회' })
  @ApiCreatedResponse({
    description: '가게 리뷰 조회',
    type: [ResponseReviewDto],
  })
  @ApiNotFoundResponse({ description: '해당 상점이 존재하지 않습니다.' })
  async getStoreReview(
    @Param('storeId') storeId: string,
  ): Promise<ResponseReviewDto[]> {
    const result: ResponseReviewDto[] =
      await this.reviewsService.getStoreReview(+storeId);

    return result;
  }
}
