import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseReviewDto } from './dto/response-review.dto';

@Injectable()
export class ReviewsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(
    userId: number,
    storeId: number,
    content: string,
    star: number,
  ): Promise<{ message: string }> {
    await this.prisma.reviews.create({
      data: { userId, storeId, content, star },
    });

    return { message: '리뷰 작성 완료.' };
  }

  async getStoreReview(storeId: number): Promise<ResponseReviewDto[]> {
    const storeExists = await this.prisma.stores.findUnique({
      where: { storeId },
      select: { storeId: true },
    });

    if (!storeExists) {
      throw new NotFoundException('해당 상점이 존재하지 않습니다.');
    }

    const rawStoreReviews = await this.prisma.reviews.findMany({
      where: { storeId },
      select: {
        content: true,
        star: true,
        createdAt: true,
        User: {
          select: {
            nickname: true,
          },
        },
      },
    });

    const storeReviews: ResponseReviewDto[] = rawStoreReviews.map((review) => ({
      content: review.content,
      star: review.star,
      createdAt: review.createdAt,
      nickname: review.User.nickname,
    }));

    return storeReviews;
  }
}
