import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { ItemsRepository } from 'src/items/items.repository';
import { LikesRepository } from 'src/likes/likes.repository';
import { StoresController } from './stores.controller';
import { StoresRepository } from './stores.repository';
import { StoresService } from './stores.service';

export interface StoresMocks {
  mockStoresRepository: any;
  mockItemsRepository: any;
  mockLikesRepository: any;
}

export const storesTestingModule = async (): Promise<{
  moduleBuilder: TestingModuleBuilder;
  mocks: StoresMocks;
}> => {
  const mockStoresRepository = {
    selectAllStore: jest.fn(),
    selectOneStore: jest.fn(),
    updateStore: jest.fn(),
    deleteStore: jest.fn(),
  };
  const mockItemsRepository = {
    selectAllItems: jest.fn(),
  };
  const mockLikesRepository = {
    checkRelation: jest.fn(),
  };

  const mocks: StoresMocks = {
    mockStoresRepository,
    mockItemsRepository,
    mockLikesRepository,
  };

  return {
    moduleBuilder: Test.createTestingModule({
      providers: [
        StoresController,
        StoresService,
        { provide: StoresRepository, useValue: mockStoresRepository },
        { provide: ItemsRepository, useValue: mockItemsRepository },
        { provide: LikesRepository, useValue: mockLikesRepository },
      ],
    }),
    mocks,
  };
};
