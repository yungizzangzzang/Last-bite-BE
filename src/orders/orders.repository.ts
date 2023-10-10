import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OneOrderDTO } from './dto/get-one-order.dto';
import { UserOrdersDTO } from './dto/get-user-orders.dto';

@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUserOrders(userId: number) {
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
      })),
      star: rawOrder.Review?.star,
    }));

    return orders;
  }

  async getOneOrder(orderId: number) {
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
      throw new HttpException('선택한 페이지를 찾을 수 없습니다.', 404);
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
    };

    return order;
  }
}
