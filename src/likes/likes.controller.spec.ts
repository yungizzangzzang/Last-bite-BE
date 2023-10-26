import { TestingModule } from '@nestjs/testing';
import { LikesController } from './likes.controller';
import { LikesMocks, likesTestingModule } from './likes.test-utils';

describe('LikesController', () => {
  let controller: LikesController;
  let mocks: LikesMocks;

  beforeEach(async () => {
    const { moduleBuilder, mocks: mockObjects } = await likesTestingModule();
    const module: TestingModule = await moduleBuilder.compile();
    controller = module.get<LikesController>(LikesController);
    mocks = mockObjects;

    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
