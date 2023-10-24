import { TestingModule } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { ItemsMocks, itemsTestingModule } from './items.test-utils';

describe('ItemsService', () => {
  let service: ItemsService;
  let mocks: ItemsMocks;

  beforeEach(async () => {
    const { moduleBuilder, mocks: mockObjects } = await itemsTestingModule();
    const module: TestingModule = await moduleBuilder.compile();
    service = module.get<ItemsService>(ItemsService);
    mocks = mockObjects;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
