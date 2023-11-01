import { HttpStatus } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { CreateOrderItemDto } from './../order-items/dto/create-order-item.dto';
import { OrderItemsRepository } from './../order-items/order-items.repository';
import { CreateOrderOrderItemDto } from './dto/create-order.dto';
import { OneOrderDTO, OrderItemDetailDTO } from './dto/get-one-order.dto';
import { UserOrdersDTO } from './dto/get-user-orders.dto';
import { OrdersRepository } from './orders.repository';
import { OrdersService } from './orders.service';
import { ordersTestingModule } from './orders.test-utils';

describe('OrdersService', () => {
  let service: OrdersService;
  let ordersRepository: OrdersRepository;
  let orderItemsRepository: OrderItemsRepository;
  let mocks: any;

  beforeEach(async () => {
    const { moduleBuilder, mocks: mockObjects } = await ordersTestingModule();
    const module: TestingModule = await moduleBuilder.compile();
    service = module.get<OrdersService>(OrdersService);
    ordersRepository = module.get<OrdersRepository>(OrdersRepository);
    orderItemsRepository =
      module.get<OrderItemsRepository>(OrderItemsRepository);
    mocks = mockObjects;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** Test1: 고객의 주문 (Post) */
  describe('CreatedOrder with createOrderItemDto,userId', () => {
    const createOrderOrderItemDto: CreateOrderOrderItemDto = {
      discount: 22,
      storeId: 2,
      totalPrice: 12000,
      items: [
        { orderId: 1, itemId: 1, count: 2 },
        { orderId: 1, itemId: 2, count: 4 },
      ],
    };
    const mockItems = [
      { itemId: 1, name: 'Item1', count: 10 },
      { itemId: 2, name: 'Item2', count: 5 },
    ];

    it('1-1(err) -> 주문 수량이 모자른 경우', async () => {
      const user: any = {
        userId: 1,
        isClient: true,
        point: 10000,
      };
      createOrderOrderItemDto.items[1].count = 6; // mockItems의 재고량보다 많이
      const mockError: any = {
        response: {
          message: [],
        },
        status: HttpStatus.BAD_REQUEST,
      };

      for (let i = 0; i < mockItems.length; i++) {
        if (mockItems[i].count < createOrderOrderItemDto.items[i].count) {
          mockError.response.message.push(
            `${mockItems[i].name}의 주문 가능 수량은 ${mockItems[i].count}개 입니다`,
          );
        }
      }

      try {
        await service.createOrder(
          createOrderOrderItemDto,
          user.userId,
          user.point,
        );
        fail('에러가 발생하지 않으면 실패입니다');
      } catch (err) {
        expect(mockError.response.message).toStrictEqual([
          'Item2의 주문 가능 수량은 5개 입니다',
        ]);
        expect(mockError.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('1-2(success) -> ordersrepo.createOrder, orderitemrepo.createOrderItem', async () => {
      const user: any = {
        userId: 1,
        isClient: true,
        point: 15000,
      };

      const createOrderDto: any = {
        userId: 1,
        discount: 22,
        storeId: 2,
        totalPrice: 12000,
        orderId: 3,
      };

      const createOrderItemDto: CreateOrderItemDto[] = [
        { orderId: 1, itemId: 2, count: 3 },
      ];
      const tmpOrderId = 5;
      jest.spyOn(service, 'createOrder').mockResolvedValue(createOrderDto);
      jest
        .spyOn(ordersRepository, 'createOrder')
        .mockResolvedValue(createOrderDto);
      jest
        .spyOn(orderItemsRepository, 'createOrderItem')
        .mockResolvedValue(createOrderItemDto);

      // service.createOrder함수 호출
      const result = await service.createOrder(
        createOrderOrderItemDto,
        user,
        user.point,
      );
      await ordersRepository.createOrder(
        createOrderOrderItemDto,
        user,
        user.point,
      );
      await orderItemsRepository.createOrderItem(
        tmpOrderId,
        createOrderItemDto,
      );

      expect(result).toEqual(createOrderDto);
      expect(service.createOrder).toHaveBeenCalledWith(
        createOrderOrderItemDto,
        user,
        user.point,
      );
      expect(ordersRepository.createOrder).toBeCalledTimes(1);
      expect(orderItemsRepository.createOrderItem).toBeCalledTimes(1);
    });
  });

  /** Test2: 특정 고객의 모든 주문 정보 확인(GET) */
  describe('getUserOrders with userId', () => {
    it('test2', async () => {
      const user: any = {
        userId: 1,
        isClient: true,
        point: 15000,
      };
      const orders: UserOrdersDTO[] = [
        {
          orderId: 1,
          discount: 11,
          createdAt: new Date(),
          storeId: 1,
          storeName: '희재',
          items: [{ name: '치킨', imgUrl: 'any', count: 1 }],
          star: 1,
        },
      ];

      jest.spyOn(service, 'getUserOrders').mockResolvedValue(orders);
      jest.spyOn(ordersRepository, 'getUserOrders').mockResolvedValue(orders);

      const result = await service.getUserOrders(user.userId);
      await ordersRepository.getUserOrders(user.userId);

      expect(result).toEqual(orders);
      expect(service.getUserOrders).toHaveBeenCalledWith(user.userId);
      expect(ordersRepository.getUserOrders).toBeCalledTimes(1);
    });
  });

  /** Test3: 특정 주문 정보 확인(GET) */
  describe('getOneOrder with orderId', () => {
    it('test3', async () => {
      const mockItems: OrderItemDetailDTO[] = [
        {
          name: '떡볶이',
          count: 3,
        },
        {
          name: '오징어튀김',
          count: 5,
        },
      ];
      const mockOrder: OneOrderDTO = {
        orderId: 1,
        totalPrice: 15000,
        discount: 22,
        createdAt: new Date(),
        items: mockItems,
        storeName: '분식',
        ordered: true,
      };

      jest.spyOn(service, 'getOneOrder').mockResolvedValue(mockOrder);
      jest.spyOn(ordersRepository, 'getOneOrder').mockResolvedValue(mockOrder);

      const result = await service.getOneOrder(mockOrder.orderId);
      await ordersRepository.getOneOrder(mockOrder.orderId);

      expect(result).toEqual(mockOrder);
      expect(service.getOneOrder).toHaveBeenCalledWith(mockOrder.orderId);
      expect(ordersRepository.getOneOrder).toBeCalledTimes(1);
    });
  });
});
