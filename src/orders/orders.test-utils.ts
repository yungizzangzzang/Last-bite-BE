import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { ItemsRepository } from 'src/items/items.repository';
import { OrderItemsRepository } from 'src/order-items/order-items.repository';
import { OrdersRepository } from 'src/orders/orders.repository';
import { OrdersService } from './orders.service';

export const ordersTestingModule = async (): Promise<{
  moduleBuilder: TestingModuleBuilder;
  mocks: any;
}> => {
  const mockOrdersRepository = {};
  const mockOrderItemsRepository = {};
  const mockEventEmitter = {};
  const mockItemsRepository = {};
  const mockQueue = {};

  return {
    moduleBuilder: Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: OrdersRepository, useValue: mockOrdersRepository },
        { provide: OrderItemsRepository, useValue: mockOrderItemsRepository },
        { provide: EventEmitter2, useValue: mockEventEmitter },
        { provide: ItemsRepository, useValue: mockItemsRepository },
        { provide: 'ordersQueue', useValue: mockQueue },
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
