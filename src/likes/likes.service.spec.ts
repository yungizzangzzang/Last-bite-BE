import { TestingModule } from '@nestjs/testing';
import { LikesService } from './likes.service';
import {
  LikesMocks,
  likesTestingModule,
  mockUserLikedStores,
} from './likes.test-utils';

describe('LikesService', () => {
  let service: LikesService;
  let mocks: LikesMocks;

  beforeEach(async () => {
    const { moduleBuilder, mocks: mockObjects } = await likesTestingModule();
    const module: TestingModule = await moduleBuilder.compile();
    service = module.get<LikesService>(LikesService);
    mocks = mockObjects;

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrDeleteFavoriteStore', () => {
    it('유저가 좋아요를 누른 가게가 존재하지 않을 경우 NotFoundException을 던져야 함', async () => {
      mocks.mockStoresRepository.selectOneStore.mockResolvedValue(null);

      await expect(
        service.createOrDeleteFavoriteStore(
          expect.any(Number),
          expect.any(Number),
        ),
      ).rejects.toThrow('해당하는 가게가 존재하지 않습니다.');
    });

    it('유저가 좋아요를 홀수번 누른 가게를 유저의 단골 가게로 등록', async () => {
      const likeArrayLength = 0;
      const mockLikesArray = Array.from({ length: likeArrayLength }, () => ({
        userId: expect.any(Number),
        storeId: expect.any(Number),
      }));
      mocks.mockStoresRepository.selectOneStore.mockResolvedValue(true);
      mocks.mockLikesRepository.checkRelation.mockResolvedValue(mockLikesArray);
      mocks.mockLikesRepository.createFavoriteStore.mockResolvedValue({
        message: '좋아요 등록 성공',
      });
      if (mockLikesArray.length === 0) {
        const result = await mocks.mockLikesRepository.createFavoriteStore(
          expect.any(Number),
          expect.any(Number),
        );
        expect(result).toEqual({ message: '좋아요 등록 성공' });
      }
    });

    it('유저가 좋아요를 짝수번 누른 가게를 유저의 단골 가게에서 삭제', async () => {
      const likeArrayLength = 1;
      const mockLikesArray = Array.from({ length: likeArrayLength }, () => ({
        userId: expect.any(Number),
        storeId: expect.any(Number),
      }));
      mocks.mockStoresRepository.selectOneStore.mockResolvedValue(true);
      mocks.mockLikesRepository.checkRelation.mockResolvedValue(mockLikesArray);
      mocks.mockLikesRepository.deleteFavoriteStore.mockResolvedValue({
        message: '좋아요 취소 성공',
      });

      if (mockLikesArray.length !== 0) {
        const result = await mocks.mockLikesRepository.deleteFavoriteStore(
          expect.any(Number),
          expect.any(Number),
        );
        expect(result).toEqual({ message: '좋아요 취소 성공' });
      }
    });
  });

  describe('getAllFavoriteStore', () => {
    it('유저의 단골 가게 조회', async () => {
      const result = await mocks.mockLikesRepository.selectAllFavoriteStore(
        expect.any(Number),
      );
      expect(result).toEqual({ stores: mockUserLikedStores });
    });
  });
});
