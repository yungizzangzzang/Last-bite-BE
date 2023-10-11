import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';

@Injectable()
export class OrderItemsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // * storeId, user 정보에서 받아올 수 있게 수정
  // ? DB에서 startTime을 빼고, 핫딜 시작 시간을 등록 시점부터 하면 어떨까요??
  async createOrderItem(
    createOrderItem: CreateOrderItemDto,
    orderId: number,
  ): Promise<void> {
    await this.prisma.ordersItems.create({
      data: {
        itemId: createOrderItem.itemId,
        count: createOrderItem.count,
        orderId,
      },
    });
  }
}
