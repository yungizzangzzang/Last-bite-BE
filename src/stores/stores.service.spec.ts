import { TestingModule } from '@nestjs/testing';
import { StoresService } from './stores.service';
import { StoresMocks, storesTestingModule } from './stores.test-utils';

describe('StoresService', () => {
  let service: StoresService;
  let mocks: StoresMocks;

  beforeEach(async () => {
    const { moduleBuilder, mocks: mockObjects } = await storesTestingModule();
    const module: TestingModule = await moduleBuilder.compile();
    service = module.get<StoresService>(StoresService);
    mocks = mockObjects;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
