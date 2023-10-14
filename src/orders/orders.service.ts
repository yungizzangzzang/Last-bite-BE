import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ItemsRepository } from 'src/items/items.repository';
import { OrderItemsRepository } from 'src/order-items/order-items.repository';
import { CreateOrderOrderItemDto } from './dto/create-order.dto';
import { OneOrderDTO } from './dto/get-one-order.dto';
import { UserOrdersDTO } from './dto/get-user-orders.dto';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly orderItemsRepository: OrderItemsRepository,
    private readonly itemsRepository: ItemsRepository,
  ) {}

  // * return에서 {} 감싸도 create 혹은 완료 메세지 출력에 이상 없는지 확인!

  async createOrder(
    createOrderOrderItemDto: CreateOrderOrderItemDto,
    userId: number,
  ): Promise<{ message: string }> {
    const results: (string | undefined)[] = await Promise.all(
      createOrderOrderItemDto.items.map(async (orderItem) => {
        const itemId = orderItem.itemId;
        const item = await this.itemsRepository.getOneItem(itemId);

        // Items.count < OrderItems.count 일때 주문 불가
        if (orderItem.count > item.count) {
          return `${item.name}의 주문 가능 수량은 ${item.count}개 입니다.`;
        } 
      }),
    );

    // if 문 true 일 때 반환되는 undefined 제거
    const filteredResults = results.filter(result => result !== undefined);

    // 에러 메세지 반환
    if (filteredResults.length > 0) {
      throw new HttpException(
        { message: filteredResults },
        HttpStatus.BAD_REQUEST,
      );
    }

    const order = await this.ordersRepository.createOrder(
      createOrderOrderItemDto,
      userId,
    );
    
    await this.orderItemsRepository.createOrderItem(
      order.orderId,
      createOrderOrderItemDto.items,
    );
    
    return { message: '예약이 완료되었습니다.' };
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
