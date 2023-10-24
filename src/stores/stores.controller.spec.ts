import { TestingModule } from '@nestjs/testing';
import { StoresController } from './stores.controller';
import { StoresMocks, storesTestingModule } from './stores.test-utils';

describe('StoresController', () => {
  let controller: StoresController;
  let mocks: StoresMocks;

  beforeEach(async () => {
    const { moduleBuilder, mocks: mockObjects } = await storesTestingModule();
    const module: TestingModule = await moduleBuilder.compile();
    controller = module.get<StoresController>(StoresController);
    mocks = mockObjects;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
