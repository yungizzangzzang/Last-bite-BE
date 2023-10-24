import { TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { ordersTestingModule } from './orders.test-utils';

describe('OrdersController', () => {
  let controller: OrdersController;
  let mocks: any;

  beforeEach(async () => {
    const { moduleBuilder, mocks: mockObjects } = await ordersTestingModule();
    const module: TestingModule = await moduleBuilder.compile();
    controller = module.get<OrdersController>(OrdersController);
    mocks = mockObjects;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });
});
