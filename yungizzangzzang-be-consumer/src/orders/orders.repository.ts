import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateOrderDto,
  CreateOrderOrderItemDto,
} from './dto/create-order.dto';
@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(
    createOrderOrderItemDto: CreateOrderOrderItemDto,
    userId: number,
    redisUserPoint,
  ): Promise<CreateOrderDto> {
    const {
      storeId,
      totalPrice,
      discount,
      items: orderItems,
    } = createOrderOrderItemDto;

    const transactionOrders: any[] = [];

    // 주문 상품 DB 조회
    const itemIds = orderItems.map((orderItem) => orderItem.itemId);
    const findItem = await this.prisma.items.findMany({
      where: { itemId: { in: itemIds } },
      select: { storeId: true, count: true, price: true, name: true },
    });

    const [items, store, user] = await Promise.all([
      findItem,
      await this.prisma.stores.findUnique({ where: { storeId } }),
      await this.prisma.users.findUnique({
        where: { userId },
        select: { point: true },
      }),
    ]);

    if (items.length !== orderItems.length) {
      throw new HttpException(
        { message: '아이템 정보가 올바르지 않습니다.' },
        HttpStatus.BAD_REQUEST,
      );
    }

    // storeId에 해당하는 Stores 없는 경우
    if (!store) {
      throw new HttpException(
        { message: '가게 정보가 존재하지 않습니다.' },
        HttpStatus.NOT_FOUND,
      );
    }

    // 아이템(핫딜)의 storeId(가게정보)와 입력된 storeId가 다른 경우
    for (let i = 0; i < items.length; i++) {
      if (items[i].storeId !== storeId) {
        throw new HttpException(
          { message: '가게 정보가 올바르지 않습니다.' },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // items.count 업데이트 - 재고 수량 검증
    const filteredResults: string[] | undefined = [];

    for (let i = 0; i < orderItems.length; i++) {
      if (items[i].count < orderItems[i].count) {
        filteredResults.push(
          `${items[i].name}의 주문 가능 수량은 ${items[i].count}개 입니다.`,
        );
      }
    }

    if (filteredResults.length > 0) {
      throw new HttpException(
        { message: filteredResults },
        HttpStatus.BAD_REQUEST,
      );
    }

    // items.count 업데이트
    for (let i = 0; i < items.length; i++) {
      transactionOrders.push(
        this.prisma.items.update({
          where: { itemId: orderItems[i].itemId },
          data: { count: items[i].count - orderItems[i].count },
        }),
      );
    }

    // users.point 업데이트
    transactionOrders.push(
      this.prisma.users.update({
        where: { userId },
        data: { point: redisUserPoint },
      }),
    );

    transactionOrders.push(
      // 주문 정보 생성
      this.prisma.orders.create({
        data: {
          userId,
          storeId,
          discount,
          totalPrice,
        },
      }),
    );

    const array = await this.prisma.$transaction(transactionOrders);

    const order = array[array.length - 1];

    return order;
  }
}
