import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { StoresRepository } from 'src/stores/stores.repository';
import { LikesController } from './likes.controller';
import { LikesRepository } from './likes.repository';
import { LikesService } from './likes.service';

export interface LikesMocks {
  mockLikesRepository: any;
  mockStoresRepository: any;
}

export const likesTestingModule = async (): Promise<{
  moduleBuilder: TestingModuleBuilder;
  mocks: LikesMocks;
}> => {
  const mockLikesRepository = {};
  const mockStoresRepository = {};

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
