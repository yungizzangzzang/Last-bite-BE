import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { AwsService } from './aws.service';
import { ItemsController } from './items.controller';
import { ItemsRepository } from './items.repository';
import { ItemsService } from './items.service';

export interface ItemsMocks {
  mockItemsRepository: any;
  mockAwsService: any;
}

export const itemsTestingModule = async (): Promise<{
  moduleBuilder: TestingModuleBuilder;
  mocks: ItemsMocks;
}> => {
  const mockItemsRepository = {};
  const mockAwsService = {};

  return {
    moduleBuilder: Test.createTestingModule({
      providers: [
        ItemsController,
        ItemsService,
        { provide: ItemsRepository, useValue: mockItemsRepository },
        { provide: AwsService, useValue: mockAwsService },
      ],
    }),
    mocks: {
      mockItemsRepository,
      mockAwsService,
    },
  };
};
