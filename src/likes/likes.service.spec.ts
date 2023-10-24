import { TestingModule } from '@nestjs/testing';
import { LikesService } from './likes.service';
import { LikesMocks, likesTestingModule } from './likes.test-utils';

describe('LikesService', () => {
  let service: LikesService;
  let mocks: LikesMocks;

  beforeEach(async () => {
    const { moduleBuilder, mocks: mockObjects } = await likesTestingModule();
    const module: TestingModule = await moduleBuilder.compile();
    service = module.get<LikesService>(LikesService);
    mocks = mockObjects;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });
});
