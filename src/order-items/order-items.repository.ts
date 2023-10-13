import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { GetOrderItemDto } from './dto/get-order-item.dto';

@Injectable()
export class OrderItemsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // 예약 시 개별 예약 메뉴 리스트 생성
  async createOrderItem(
    orderId: number,
    createOrderItem: CreateOrderItemDto[],
  ): Promise<CreateOrderItemDto[]> {
    
    // createOrderItem 배열 내 각 요소마다  create 실행 ([떡볶이 2인분, 순대 1인분])
    const orderItems = await Promise.all(
      createOrderItem.map(async (Item) => {
        const orderItem = await this.prisma.ordersItems.create({
          data: {
            ...Item,
            orderId,
          },
        });
        return orderItem
      }),
    );

    return  orderItems
  }

  // 예약 상세 조회 시 메뉴 리스트 조회
  // totalPrice = price * count
  async gelAllOrderItems(orderId: number): Promise<GetOrderItemDto[]> {
    const getOrderItems = await this.prisma.ordersItems.findMany({
      where: { orderId },
      select: {
        Item: {
          select: {
            name: true,
            price: true,
          },
        },
        count: true,
      },
    });

    const orderItems = getOrderItems.map((items) => ({
      count: items.count,
      ...items.Item,
      totalPrice: items.count * items.Item.price,
    }));

    return orderItems;
  }
}
