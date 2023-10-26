import { getQueueToken } from '@nestjs/bull';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { ItemsRepository } from 'src/items/items.repository';
import { OrderItemsRepository } from 'src/order-items/order-items.repository';
import { OrdersRepository } from 'src/orders/orders.repository';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

export const ordersTestingModule = async (): Promise<{
  moduleBuilder: TestingModuleBuilder;
  mocks: any;
}> => {
  const mockOrdersRepository = {
    createOrder: jest.fn(),
    getUserOrders: jest.fn(),
    getOneOrder: jest.fn(),
  };
  const mockOrderItemsRepository = {
    createOrderItem: jest.fn(),
  };
  const mockEventEmitter = {};
  const mockItemsRepository = {
    // getOneItem: jest.fn().mockResolvedValue({ count: 1 }),
    getOneItem: jest.fn(),
  };
  const mockQueue = {
    add: jest.fn(),
  };

  return {
    moduleBuilder: Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        OrdersService,
        { provide: OrdersRepository, useValue: mockOrdersRepository },
        { provide: OrderItemsRepository, useValue: mockOrderItemsRepository },
        { provide: EventEmitter2, useValue: mockEventEmitter },
        { provide: ItemsRepository, useValue: mockItemsRepository },
        { provide: getQueueToken('orders'), useValue: mockQueue },
      ],
    }),
    mocks: {
      mockOrdersRepository,
      mockOrderItemsRepository,
      mockEventEmitter,
      mockItemsRepository,
      mockQueue,
    },
  };
};
