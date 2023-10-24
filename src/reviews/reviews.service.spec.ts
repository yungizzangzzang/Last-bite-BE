import { TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { ReviewsMocks, reviewsTestingModule } from './reviews.test-utils';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let mocks: ReviewsMocks;

  beforeEach(async () => {
    const { moduleBuilder, mocks: mockObjects } = await reviewsTestingModule();
    const module: TestingModule = await moduleBuilder.compile();
    service = module.get<ReviewsService>(ReviewsService);
    mocks = mockObjects;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // createReview 테스트 코드
  describe('createReview', () => {
    it('createReview는 userId, orderId, storeId, content, star을 reviewsRepository에 전달해 리뷰를 만들어야 함', async () => {
      mocks.mockAuthService.findOneUser.mockResolvedValue(true);
      mocks.mockOrdersRepository.getOneOrderById.mockResolvedValue(true);
      mocks.mockStoresRepository.selectOneStore.mockResolvedValue(true);
      mocks.mockReviewsRepository.createReview.mockResolvedValue({
        message: '리뷰 작성 완료.',
      });

      const result = await service.createReview(1, 1, 1, {
        content: '맛있어요',
        star: 5,
      });
      expect(result).toEqual({ message: '리뷰 작성 완료.' });
      expect(mocks.mockReviewsRepository.createReview).toHaveBeenCalledWith(
        1,
        1,
        1,
        '맛있어요',
        5,
      );
    });

    it('createReview는 유저가 없을 경우 NotFoundException을 던져야 함', async () => {
      mocks.mockAuthService.findOneUser.mockResolvedValue(null);

      await expect(
        service.createReview(1, 1, 1, {
          content: '맛있어요',
          star: 5,
        }),
      ).rejects.toThrow('해당 유저를 찾을 수 없습니다.');
    });

    it('createReview는 주문이 없을 경우 NotFoundException을 던져야 함', async () => {
      mocks.mockAuthService.findOneUser.mockResolvedValue(true);
      mocks.mockOrdersRepository.getOneOrderById.mockResolvedValue(null);

      await expect(
        service.createReview(1, 1, 1, {
          content: '맛있어요',
          star: 5,
        }),
      ).rejects.toThrow('해당 주문을 찾을 수 없습니다.');
    });

    it('createReview는 가게가 없을 경우 NotFoundException을 던져야 함', async () => {
      mocks.mockAuthService.findOneUser.mockResolvedValue(true);
      mocks.mockOrdersRepository.getOneOrderById.mockResolvedValue(true);
      mocks.mockStoresRepository.selectOneStore.mockResolvedValue(null);

      await expect(
        service.createReview(1, 1, 1, {
          content: '맛있어요',
          star: 5,
        }),
      ).rejects.toThrow('해당 가게를 찾을 수 없습니다.');
    });
  });

  // getStoreReview 테스트 코드
  describe('getStoreReview', () => {
    beforeEach(() => {
      mocks.mockStoresRepository.selectOneStore.mockResolvedValue(true);
      mocks.mockReviewsRepository.getStoreReview.mockResolvedValue([
        {
          content: expect.any(String),
          star: expect.any(Number),
          createdAt: expect.any(String),
          nickname: expect.any(String),
        },
      ]);
    });

    it('storeId로 가게의 리뷰를 가져와야 함', async () => {
      const result = await service.getStoreReview(1);
      expect(result).toEqual([
        expect.objectContaining({
          content: expect.any(String),
          star: expect.any(Number),
          createdAt: expect.any(String),
          nickname: expect.any(String),
        }),
      ]);
    });

    it('getStoreReviews는 가게가 없을 경우 NotFoundException을 던져야 함', async () => {
      mocks.mockStoresRepository.selectOneStore.mockResolvedValue(null);

      await expect(service.getStoreReview(1)).rejects.toThrow(
        '해당 가게를 찾을 수 없습니다.',
      );
    });
  });
});
