import { TestingModule } from '@nestjs/testing';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { reviewsTestingModule } from './reviews.test-utils';

describe('ReviewsController', () => {
  let controller: ReviewsController;
  let service: ReviewsService;

  const mockUser = { userId: expect.any(Number) };
  const mockCreateReviewDto: CreateReviewDto = {
    content: expect.any(String),
    star: expect.any(Number),
  };

  const mockResponseReviewDto = {
    content: expect.any(String),
    star: expect.any(Number),
    createdAt: expect.any(String),
    nickname: expect.any(String),
  };

  beforeEach(async () => {
    const { moduleBuilder } = await reviewsTestingModule();
    const module: TestingModule = await moduleBuilder.compile();

    controller = module.get<ReviewsController>(ReviewsController);
    service = module.get<ReviewsService>(ReviewsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createReview', () => {
    it('리뷰 생성', async () => {
      jest
        .spyOn(controller, 'createReview')
        .mockResolvedValue({ message: expect.any(String) });

      const result = await controller.createReview(
        mockUser,
        expect.any(Number),
        expect.any(Number),
        mockCreateReviewDto,
      );
      expect(result).toEqual({ message: expect.any(String) });
      expect(controller.createReview).toHaveBeenCalledWith(
        mockUser,
        expect.any(Number),
        expect.any(Number),
        mockCreateReviewDto,
      );
    });
  });

  describe('getStoreReview', () => {
    it('특정 가게 리뷰 조회', async () => {
      jest
        .spyOn(controller, 'getStoreReview')
        .mockResolvedValue([mockResponseReviewDto]);

      const result = await controller.getStoreReview(expect.any(Number));
      expect(result).toEqual([
        {
          content: expect.any(String),
          createdAt: expect.any(String),
          nickname: expect.any(String),
          star: expect.any(Number),
        },
      ]);
      expect(controller.getStoreReview).toHaveBeenCalledWith(
        expect.any(Number),
      );
    });
  });
});
