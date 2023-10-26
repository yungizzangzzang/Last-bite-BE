import { HttpException, HttpStatus } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { CreateOrderOrderItemDto } from './dto/create-order.dto';
import { OneOrderDTO } from './dto/get-one-order.dto';
import { UserOrdersDTO } from './dto/get-user-orders.dto';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ordersTestingModule } from './orders.test-utils';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;
  let mocks: any;

  beforeEach(async () => {
    const { moduleBuilder, mocks: mockObjects } = await ordersTestingModule();
    const module: TestingModule = await moduleBuilder.compile();
    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
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
        { orderId: 1, itemId: 1, count: 0 },
        { orderId: 1, itemId: 2, count: 2 },
      ],
    };

    it('1-1(err) -> 기업 회원이 주문한 경우', async () => {
      const user: any = {
        userId: 1,
        isClient: false,
      };

      try {
        await controller.createOrder(createOrderOrderItemDto, user);
      } catch (err: any) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.response.message).toBe('일반 회원만 예약이 가능합니다.');
        expect(err.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('1-2(err) -> 보유 금액이 주문 금액보다 작은 경우', async () => {
      const user: any = {
        userId: 1,
        isClient: true,
        point: 10000, // < createdOrderOrderItemDto.totalPrice
      };

      try {
        await controller.createOrder(createOrderOrderItemDto, user);
      } catch (err: any) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.response.message).toBe('포인트를 충전해주세요.');
        expect(err.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('1-3(err) -> 주문 수량이 0인 경우', async () => {
      const user: any = {
        userId: 1,
        isClient: true,
        point: 15000,
      };

      try {
        await controller.createOrder(createOrderOrderItemDto, user);
      } catch (err: any) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.response.message).toBe('주문 수량이 0입니다.');
        expect(err.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('1-4(success) -> 정상 주문된 경우', async () => {
      const user: any = {
        userId: 1,
        isClient: true, // not false
        point: 15000, // > 12000
      };
      const createOrderDto: any = {
        userId: 1,
        discount: 22,
        storeId: 2,
        totalPrice: 10000,
        orderId: 1,
      };
      // 처음에 describe에서 정의한 숫자 바꿔서 예외3 통과
      createOrderOrderItemDto.items[0].count = 2;

      jest.spyOn(controller, 'createOrder').mockResolvedValue(createOrderDto);
      jest.spyOn(service, 'createOrder').mockResolvedValue(createOrderDto);

      // controller.createOrder함수 호출
      const result = await controller.createOrder(
        createOrderOrderItemDto,
        user,
      );
      await service.createOrder(createOrderOrderItemDto, user);

      expect(result).toEqual(createOrderDto);
      expect(controller.createOrder).toHaveBeenCalledWith(
        createOrderOrderItemDto,
        user,
      );
      expect(service.createOrder).toBeCalledTimes(1);
    });
  });

  /** Test2: 특정 고객의 모든 주문 정보 확인(GET) */
  describe('getUserOrders with userId', () => {
    it('test2', async () => {
      const user: any = {
        userId: 1,
        isClient: true, // not false
        point: 15000, // > 12000
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

      jest.spyOn(controller, 'getUserOrders').mockResolvedValue(orders);
      jest.spyOn(service, 'getUserOrders').mockResolvedValue(orders);

      const result = await controller.getUserOrders(user.userId);
      await service.getUserOrders(user.userId);

      expect(result).toEqual(orders);
      expect(controller.getUserOrders).toHaveBeenCalledWith(user.userId);
      expect(service.getUserOrders).toBeCalledTimes(1);
    });
  });

  /** Test3: 특정 주문 정보 확인(GET) */
  describe('getOneOrder with orderId', () => {
    it('test3', async () => {
      const order: OneOrderDTO = {
        orderId: 1,
        totalPrice: 15000,
        discount: 22,
        createdAt: new Date(),
        items: [],
        storeName: '분식',
        ordered: true,
      };

      jest.spyOn(controller, 'getOneOrder').mockResolvedValue(order);
      jest.spyOn(service, 'getOneOrder').mockResolvedValue(order);

      const result = await controller.getOneOrder(String(order.orderId));
      await service.getOneOrder(order.orderId);

      expect(result).toEqual(order);
      expect(controller.getOneOrder).toHaveBeenCalledWith(
        String(order.orderId),
      );
      expect(service.getOneOrder).toBeCalledTimes(1);
    });
  });
});
