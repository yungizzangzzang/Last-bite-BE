import { Injectable, NotFoundException } from '@nestjs/common';
import { OrdersRepository } from 'src/orders/orders.repository';
import { StoresRepository } from 'src/stores/stores.repository';
import { AuthService } from './../users/auth/auth.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ResponseReviewDto } from './dto/response-review.dto';
import { ReviewsRepository } from './reviews.repository';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewsRepository: ReviewsRepository,
    private readonly authService: AuthService,
    private readonly ordersRepository: OrdersRepository,
    private readonly storesRepository: StoresRepository,
  ) {}
  async createReview(
    userId: number,
    orderId: number,
    storeId: number,
    createReviewDto: CreateReviewDto,
  ): Promise<{ message: string }> {
    const isExistUser = await this.authService.findOneUser(userId);
    if (!isExistUser) {
      throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
    }

    const isExistOrder = await this.ordersRepository.getOneOrderById(orderId);
    if (!isExistOrder) {
      throw new NotFoundException('해당 주문을 찾을 수 없습니다.');
    }

    const isExistStore = await this.storesRepository.selectOneStore(storeId);
    if (!isExistStore) {
      throw new NotFoundException('해당 가게를 찾을 수 없습니다.');
    }

    const { content, star } = createReviewDto;

    const result: { message: string } =
      await this.reviewsRepository.createReview(
        userId,
        orderId,
        storeId,
        content,
        star,
      );

    return result;
  }

  async getStoreReview(storeId: number): Promise<ResponseReviewDto[]> {
    const isExistStore = await this.storesRepository.selectOneStore(storeId);
    if (!isExistStore) {
      throw new NotFoundException('해당 가게를 찾을 수 없습니다.');
    }

    const result: ResponseReviewDto[] =
      await this.reviewsRepository.getStoreReview(storeId);

    return result;
  }
}
