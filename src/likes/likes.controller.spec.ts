import { TestingModule } from '@nestjs/testing';
import { LikesController } from './likes.controller';
import { likesTestingModule, mockUserLikedStores } from './likes.test-utils';

describe('LikesController', () => {
  let controller: LikesController;

  const mockUser = { userId: expect.any(Number) };

  beforeEach(async () => {
    const { moduleBuilder } = await likesTestingModule();
    const module: TestingModule = await moduleBuilder.compile();
    controller = module.get<LikesController>(LikesController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrDeleteFavoriteStore', () => {
    it('좋아요 등록', async () => {
      jest
        .spyOn(controller, 'createOrDeleteFavoriteStore')
        .mockResolvedValue({ message: '좋아요 등록 성공' });

      const result = await controller.createOrDeleteFavoriteStore(
        mockUser.userId,
        expect.any(Number),
      );

      expect(result).toEqual({ message: '좋아요 등록 성공' });
    });

    it('좋아요 취소', async () => {
      jest
        .spyOn(controller, 'createOrDeleteFavoriteStore')
        .mockResolvedValue({ message: '좋아요 취소 성공' });

      const result = await controller.createOrDeleteFavoriteStore(
        mockUser.userId,
        expect.any(Number),
      );

      expect(result).toEqual({ message: '좋아요 취소 성공' });
    });
  });

  describe('getAllFavoriteStore', () => {
    it('유저가 좋아요 누른 가게 조회', async () => {
      jest
        .spyOn(controller, 'getAllFavoriteStore')
        .mockResolvedValue({ stores: mockUserLikedStores });

      const result = await controller.getAllFavoriteStore(mockUser.userId);

      expect(result).toEqual({ stores: mockUserLikedStores });
    });
  });
});
