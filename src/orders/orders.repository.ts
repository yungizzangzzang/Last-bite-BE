import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OneOrderDTO } from './dto/get-one-order.dto';
import { UserOrdersDTO } from './dto/get-user-orders.dto';

@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  // userId -> 로그인 정보에서 받아오기
  async createOrder(
    userId: number,
    createOrderDto: CreateOrderDto,
    // ! 타입 나중에 바꿔주기!!
  ): Promise<any> {
    console.log('요기서 부터 안된당')
    console.log(createOrderDto.storeId, createOrderDto.discount, createOrderDto.totalPrice)
    console.log(userId)
    console.log(null==undefined)
    console.log(null===undefined)
    // ? onUpdate: Cascade 외래키에 추가해보기
    const order = await this.prisma.orders.create({
      data: {
        userId,
        storeId: createOrderDto.storeId,
        discount: createOrderDto.discount,
        totalPrice: createOrderDto.totalPrice,
      },
    });

    return order;
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

    if (rawOrders.length === 0) {
      throw new HttpException('해당 사용자의 주문이 존재하지 않습니다.', 404);
    }

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
    };

    return order;
  }
}
