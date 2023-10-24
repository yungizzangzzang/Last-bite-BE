import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { Queue } from 'bull';
import { DeepMockProxy } from 'jest-mock-extended';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrdersService } from './orders.service';

export const mockBullQueue: any = {
  add: jest.fn(),
  process: jest.fn(),
};

describe('OrdersService', () => {
  let service: OrdersService;
  let queue: Queue;
  let mockPrisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService, PrismaService],
    })
      .overrideProvider(PrismaService)
      // .useValue(mockDeep<PrismaClient>())
      .useValue(mockBullQueue)
      .compile();

    service = module.get<OrdersService>(OrdersService);
    queue = module.get('OrdersQueue');
    mockPrisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(queue).toBeDefined();
    expect(mockPrisma).toBeDefined();
  });
});
