import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from 'src/prisma/prisma.service';
import { AwsService } from './aws.service';
import { ItemsController } from './items.controller';
import { ItemsRepository } from './items.repository';
import { ItemsService } from './items.service';

describe('ItemsController', () => {
  let controller: ItemsController;
  let itemsService: ItemsService;
  let awsService: AwsService;
  let repository: ItemsRepository;
  let mockPrisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [ItemsService, AwsService, PrismaService, ItemsRepository],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    controller = module.get<ItemsController>(ItemsController);
    itemsService = module.get<ItemsService>(ItemsService);
    awsService = module.get<AwsService>(AwsService);
    repository = module.get<ItemsRepository>(ItemsRepository);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(itemsService).toBeDefined();
    expect(awsService).toBeDefined();
    expect(repository).toBeDefined();
  });
});
