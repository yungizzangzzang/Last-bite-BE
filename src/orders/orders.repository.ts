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
  ): Promise<CreateOrderDto> {
  

    /**
     * Orders와 연결된 테이블 중
     * Users 없는 경우 -> userId로 찾기 (근데 이건 request로 받아와서 안해도 된당.)
     * Stores 없는 경우 -> createOrderOrderItemDto로 찾기 
     * Items 없는 경우 -> createOrderOrderItemDto.items.itemId로 찾기
     */

    // ! itemId의 storeId가 storeId와 일치
    // ! itemId로 Items 찾는다. Items.storeId 찾는다. 입력값과 맞는지 비교한다.
    // ! Itmes 없는 경우 error

    // storeId에 해당하는 Stores 없는 경우
    const store = await this.prisma.stores.findUnique({
      where: {storeId: createOrderOrderItemDto.storeId}
    })
    console.log(store)
    if( !store ) {
      throw new HttpException ({message: '가게 정보가 존재하지 않습니다.'}, HttpStatus.NOT_FOUND)
    }
    await Promise.all(
      createOrderOrderItemDto.items.map(async (Item) => {
        const item= await this.prisma.items.findUnique({
          where: { itemId: Item.itemId },
          select: { storeId: true },
        });
      // itemId 해당하는 Items 가 없는 경우
      if (!item) {
        throw new HttpException ({message: '핫딜 정보가 존재하지 않습니다.'}, HttpStatus.NOT_FOUND)
      }
      // 아이템(핫딜)의 storeId(가게정보)와 입력된 storeId가 다른 경우
      if   (item.storeId !== createOrderOrderItemDto.storeId) {
        throw new HttpException ({message: '가게 정보가 올바르지 않습니다.'}, HttpStatus.BAD_REQUEST)

      }
      })
    )

  // 주문 정보 생성
    const order = await this.prisma.orders.create({
      data: {
        userId,
        storeId: createOrderOrderItemDto.storeId,
        discount: createOrderOrderItemDto.discount,
        totalPrice: createOrderOrderItemDto.totalPrice,
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
    };

    return order;
  }
}
