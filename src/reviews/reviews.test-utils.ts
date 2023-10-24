import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { OrdersRepository } from 'src/orders/orders.repository';
import { StoresRepository } from 'src/stores/stores.repository';
import { AuthService } from 'src/users/auth/auth.service';
import { ReviewsController } from './reviews.controller';
import { ReviewsRepository } from './reviews.repository';
import { ReviewsService } from './reviews.service';

export const reviewsTestingModule = async (): Promise<{
  moduleBuilder: TestingModuleBuilder;
  mocks: any;
}> => {
  const mockReviewsRepository = {
    createReview: jest.fn(),
    getStoreReview: jest.fn(),
  };

  const mockAuthService = {
    findOneUser: jest.fn(),
  };

  const mockOrdersRepository = {
    getOneOrderById: jest.fn(),
  };

  const mockStoresRepository = {
    selectOneStore: jest.fn(),
  };

  return {
    moduleBuilder: Test.createTestingModule({
      providers: [
        ReviewsController,
        ReviewsService,
        { provide: ReviewsRepository, useValue: mockReviewsRepository },
        { provide: AuthService, useValue: mockAuthService },
        { provide: OrdersRepository, useValue: mockOrdersRepository },
        { provide: StoresRepository, useValue: mockStoresRepository },
      ],
    }),
    mocks: {
      mockReviewsRepository,
      mockAuthService,
      mockOrdersRepository,
      mockStoresRepository,
    },
  };
};
