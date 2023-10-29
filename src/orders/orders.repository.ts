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

    const transactionOrders: any[] = [];

    await Promise.all(
      createOrderOrderItemDto.items.map(async (Item) => {
        const itemId = Item.itemId;

        // Item에 대한 락
        // await this.prisma
        //   .$executeRaw`SELECT * FROM items WHERE itemId = ${itemId} FOR UPDATE`;

        const item = await this.prisma.items.findUnique({
          where: { itemId },
          select: { storeId: true, count: true, price: true },
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

        // User에 대한 락
        // await this.prisma
        //   .$executeRaw`SELECT * FROM users WHERE userId = ${userId} FOR UPDATE`;

        const user = await this.prisma.users.findUnique({
          where: { userId },
          select: { point: true },
        });
        if (!user) {
          throw new HttpException(
            { message: '사용자 정보가 존재하지 않습니다.' },
            HttpStatus.NOT_FOUND,
          );
        }

        transactionOrders.push(
          // count update
          this.prisma.items.update({
            where: { itemId },
            data: { count: item.count - Item.count },
          }),

          // point update
          this.prisma.users.update({
            where: { userId },
            data: { point: user.point - createOrderOrderItemDto.totalPrice },
          }),
        );
        // count === 0 일때 deletedAt 업데이트
        await this.prisma.items
          .findUnique({
            where: { itemId, count: 0 },
            select: { deletedAt: true, itemId: true },
          })
          .then((itemToUpdate) => {
            if (itemToUpdate) {
              this.prisma.items.update({
                where: { itemId: itemToUpdate.itemId },
                data: { deletedAt: new Date() },
              });
            }
          });
      }),
    );

    transactionOrders.push(
      // 주문 정보 생성
      this.prisma.orders.create({
        data: {
          userId,
          storeId: createOrderOrderItemDto.storeId,
          discount: createOrderOrderItemDto.discount,
          totalPrice: createOrderOrderItemDto.totalPrice,
        },
      }),
    );

    const [_, __, order] = await this.prisma.$transaction(transactionOrders);

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
