import { TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { ordersTestingModule } from './orders.test-utils';

export const mockBullQueue: any = {
  add: jest.fn(),
  process: jest.fn(),
};

describe('OrdersService', () => {
  let service: OrdersService;
  let mocks: any;

  beforeEach(async () => {
    const { moduleBuilder, mocks: mockObjects } = await ordersTestingModule();
    const module: TestingModule = await moduleBuilder.compile();
    service = module.get<OrdersService>(OrdersService);
    mocks = mockObjects;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });
});
