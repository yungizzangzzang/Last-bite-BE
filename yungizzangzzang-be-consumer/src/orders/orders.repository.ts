import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateOrderDto,
  CreateOrderOrderItemDto,
} from './dto/create-order.dto';
import { OneOrderDTO } from './dto/get-one-order.dto';
import { UserOrdersDTO } from './dto/get-user-orders.dto';
@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(
    createOrderOrderItemDto: CreateOrderOrderItemDto,
    userId: number,
    items,
  ): Promise<CreateOrderDto> {
    const {
      discount,
      storeId,
      totalPrice,
      items: orderItems,
    } = createOrderOrderItemDto;

    const transactionOrders: any[] = [];

    // count update
    for (let i = 0; i < items.length; i++) {
      transactionOrders.push(
        this.prisma.items.update({
          where: { itemId: orderItems[i].itemId },
          data: { count: items[i].count - orderItems[i].count },
        }),
      );
    }

    const user = await this.prisma.users.findUnique({
      where: { userId },
      select: { point: true },
    });

    if (user.point < totalPrice) {
      throw new HttpException(
        { message: '포인트를 충전해주세요.' },
        HttpStatus.BAD_REQUEST,
      );
    }

    // point update
    transactionOrders.push(
      this.prisma.users.update({
        where: { userId },
        data: { point: user.point - totalPrice },
      }),
    );

    // 주문 정보 생성
    transactionOrders.push(
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

    return array[array.length - 1];
  }

  async getUserOrders(userId: number): Promise<UserOrdersDTO[]> {
    const rawOrders = await this.prisma.orders.findMany({
      where: {
        userId: userId,
      },
      select: {
        orderId: true,
        discount: true,
        createdAt: true,
        Store: {
          select: {
            storeId: true,
            name: true,
          },
        },
        OrdersItems: {
          select: {
            Item: {
              select: {
                count: true,
                name: true,
                imgUrl: true,
              },
            },
          },
        },
        Review: {
          select: {
            star: true,
          },
        },
      },
    });

    const orders: UserOrdersDTO[] = rawOrders.map((rawOrder) => ({
      orderId: rawOrder.orderId,
      discount: rawOrder.discount,
      createdAt: rawOrder.createdAt,
      storeId: rawOrder.Store.storeId,
      storeName: rawOrder.Store.name,
      items: rawOrder.OrdersItems.map((orderItem) => ({
        name: orderItem.Item.name,
        imgUrl: orderItem.Item.imgUrl,
        count: orderItem.Item.count,
      })),
      star: rawOrder.Review?.star,
    }));
    return orders;
  }

  async getOneOrder(orderId: number): Promise<OneOrderDTO> {
    const rawOrder = await this.prisma.orders.findFirst({
      where: { orderId },
      select: {
        orderId: true,
        totalPrice: true,
        discount: true,
        createdAt: true,
        OrdersItems: {
          select: {
            Item: {
              select: {
                name: true,
              },
            },
            count: true,
          },
        },
        Store: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!rawOrder) {
      throw new HttpException('페이지를 찾을 수 없습니다.', 404);
    }

    if (!rawOrder.Store || !rawOrder.OrdersItems) {
      throw new HttpException('주문 정보가 완전하지 않습니다.', 400);
    }

    const order: OneOrderDTO = {
      orderId: rawOrder.orderId,
      totalPrice: rawOrder.totalPrice,
      discount: rawOrder.discount,
      createdAt: rawOrder.createdAt,
      items: rawOrder.OrdersItems.map((orderItem) => ({
        name: orderItem.Item.name,
        count: orderItem.count,
      })),
      storeName: rawOrder.Store.name,
      ordered: false,
    };

    return order;
  }

  async getOneOrderById(orderId: number) {
    const order = await this.prisma.orders.findFirst({
      where: { orderId },
    });

    return order;
  }
}
