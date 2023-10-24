import { TestingModule } from '@nestjs/testing';
import { ReviewsController } from './reviews.controller';
import { ReviewsMocks, reviewsTestingModule } from './reviews.test-utils';

describe('ReviewsController', () => {
  let controller: ReviewsController;
  let mocks: ReviewsMocks;

  beforeEach(async () => {
    const { moduleBuilder, mocks: mockObjects } = await reviewsTestingModule();
    const module: TestingModule = await moduleBuilder.compile();
    controller = module.get<ReviewsController>(ReviewsController);
    mocks = mockObjects;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
