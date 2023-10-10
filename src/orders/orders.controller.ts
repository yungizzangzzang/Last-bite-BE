import { Controller, Get, Param } from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { OneOrderDTO } from './dto/get-one-order.dto';
import { UserOrdersDTO } from './dto/get-user-orders.dto';

import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getUserOrders(@User() user) {
    const { userId } = user;
    const result: UserOrdersDTO[] = await this.ordersService.getUserOrders(
      userId,
    );

    return result;
  }

  @Get(':orderId')
  async getOneOrder(@Param('orderId') orderId: string) {
    const result: OneOrderDTO = await this.ordersService.getOneOrder(+orderId);

    return result;
  }
}
