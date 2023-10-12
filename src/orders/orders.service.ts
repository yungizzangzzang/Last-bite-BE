import { Injectable } from '@nestjs/common';
import { CreateOrderItemDto } from 'src/order-items/dto/create-order-item.dto';
import { OrderItemsRepository } from 'src/order-items/order-items.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { OneOrderDTO, OrderItemDetailDTO } from './dto/get-one-order.dto';
import { UserOrdersDTO } from './dto/get-user-orders.dto';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly orderItemsRepository: OrderItemsRepository,
  ) {}

  // * return에서 {} 감싸도 create 혹은 완료 메세지 출력에 이상 없는지 확인!
  // * userId 로그인 정보에서 받아오기

  async createOrder(
    createOrderDto: CreateOrderDto,
  ): Promise<{ message: string }> {
    const userId: number = 1;
    console.log(createOrderDto)
    console.log(createOrderDto.items)
    const order = await this.ordersRepository.createOrder(
      userId,
      createOrderDto,
    );
    await this.orderItemsRepository.createOrderItem(
      order.orderId,
      createOrderDto.items,
    );
        return { message: "주문이 완료되었습니다."};
  }

  async getUserOrders(userId: number) {
    const result: UserOrdersDTO[] = await this.ordersRepository.getUserOrders(
      userId,
    );
    return result;
  }

  async getOneOrder(orderId: number) {
    const result: OneOrderDTO = await this.ordersRepository.getOneOrder(
      orderId,
    );
    return result;
  }
}
