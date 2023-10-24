import { TestingModule } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { itemsTestingModule } from './items.test-utils';

describe('ItemsService', () => {
  let service: ItemsService;
  let mocks: any;

  beforeEach(async () => {
    const { moduleBuilder, mocks: mockObjects } = await itemsTestingModule();
    const module: TestingModule = await moduleBuilder.compile();
    service = module.get<ItemsService>(ItemsService);
    mocks = mockObjects;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });
});
