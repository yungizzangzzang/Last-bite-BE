import { TestingModule } from '@nestjs/testing';
import { ItemsController } from './items.controller';
import { ItemsMocks, itemsTestingModule } from './items.test-utils';

describe('ItemsController', () => {
  let controller: ItemsController;
  let mocks: ItemsMocks;

  beforeEach(async () => {
    const { moduleBuilder, mocks: mockObjects } = await itemsTestingModule();
    const module: TestingModule = await moduleBuilder.compile();
    controller = module.get<ItemsController>(ItemsController);
    mocks = mockObjects;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
