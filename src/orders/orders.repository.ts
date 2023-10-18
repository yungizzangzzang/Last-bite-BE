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
    const store = await this.prisma.stores.findUnique({
      where: { storeId: createOrderOrderItemDto.storeId },
    });
    // storeId에 해당하는 Stores 없는 경우
    if (!store) {
      throw new HttpException(
        { message: '가게 정보가 존재하지 않습니다.' },
        HttpStatus.NOT_FOUND,
      );
    }
    await Promise.all(
      createOrderOrderItemDto.items.map(async (Item) => {
        const itemId = Item.itemId;
        const item = await this.prisma.items.findUnique({
          where: { itemId },
          select: { storeId: true, count: true },
        });
        // itemId 해당하는 Items 가 없는 경우
        if (!item) {
          throw new HttpException(
            { message: '핫딜 정보가 존재하지 않습니다.' },
            HttpStatus.NOT_FOUND,
          );
        }
        // 아이템(핫딜)의 storeId(가게정보)와 입력된 storeId가 다른 경우
        if (item.storeId !== createOrderOrderItemDto.storeId) {
          throw new HttpException(
            { message: '가게 정보가 올바르지 않습니다.' },
            HttpStatus.BAD_REQUEST,
          );
        }

        // 주문 create 후 count update
        await this.prisma.items.update({
          where: { itemId },
          data: { count: item.count - Item.count },
        });
        
        // count === 0 일때 deletedAt 업데이트
        const itemToUpdate = await this.prisma.items.findUnique({
          where: { itemId, count: 0 },
          select: { deletedAt: true, itemId: true },
        });
        if (itemToUpdate) {
          await this.prisma.items.update({
            where: { itemId: itemToUpdate.itemId },
            data: { deletedAt: new Date() },
          });
        }
      }),
    );

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

  async updateOrdered(
    orderId: number,
    count: number,
    itemId: number,
  ): Promise<void> {
    const order = await this.prisma.orders.findFirst({
      where: { orderId },
    });

    if (order) {
      const decreasedOrders = await this.prisma.items.update({
        where: { itemId },
        data: { count },
      });
      {
        count--, order?.ordered;
      }
    }
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
}
