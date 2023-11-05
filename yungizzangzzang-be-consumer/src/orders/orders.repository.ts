import { Injectable } from '@nestjs/common';
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
  ): Promise<CreateOrderDto> {
    const { storeId, totalPrice, discount } = createOrderOrderItemDto;

    const order = await this.prisma.orders.create({
      data: {
        userId,
        storeId,
        discount,
        totalPrice,
      },
    });

    return order;
  }
}
