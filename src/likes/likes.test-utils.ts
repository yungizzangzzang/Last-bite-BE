import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { StoresRepository } from 'src/stores/stores.repository';
import { LikesController } from './likes.controller';
import { LikesRepository } from './likes.repository';
import { LikesService } from './likes.service';

export interface LikesMocks {
  mockLikesRepository: {
    checkRelation: jest.Mock;
    createFavoriteStore: jest.Mock;
    deleteFavoriteStore: jest.Mock;
    selectAllFavoriteStore: jest.Mock;
  };
  mockStoresRepository: {
    selectAllStore: jest.Mock;
    selectOneStore: jest.Mock;
    updateStore: jest.Mock;
    deleteStore: jest.Mock;
  };
}

export const likesTestingModule = async (): Promise<{
  moduleBuilder: TestingModuleBuilder;
  mocks: LikesMocks;
}> => {
  const mockLikesRepository = {
    checkRelation: jest.fn(),
    createFavoriteStore: jest.fn(),
    deleteFavoriteStore: jest.fn(),
    selectAllFavoriteStore: jest.fn(),
  };

  const mockStoresRepository = {
    selectAllStore: jest.fn(),
    selectOneStore: jest.fn(),
    updateStore: jest.fn(),
    deleteStore: jest.fn(),
  };

  return {
    moduleBuilder: Test.createTestingModule({
      providers: [
        LikesController,
        LikesService,
        { provide: LikesRepository, useValue: mockLikesRepository },
        { provide: StoresRepository, useValue: mockStoresRepository },
      ],
    }),
    mocks: {
      mockLikesRepository,
      mockStoresRepository,
    },
  };
};
