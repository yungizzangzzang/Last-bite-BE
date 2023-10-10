import { Controller, Get, HttpException, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { OneOrderDTO } from './dto/get-one-order.dto';
import { UserOrdersDTO } from './dto/get-user-orders.dto';

import { OrdersService } from './orders.service';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: '사용자의 모든 주문 조회' })
  @ApiOkResponse({ type: [UserOrdersDTO], description: '사용자의 주문 목록' })
  async getUserOrders(@User() user) {
    const { userId } = user;
    const result: UserOrdersDTO[] = await this.ordersService.getUserOrders(
      userId,
    );

    return result;
  }

  @Get(':orderId')
  @ApiOperation({ summary: '특정 주문 조회' })
  @ApiOkResponse({ type: OneOrderDTO, description: '특정 주문의 상세 정보' })
  async getOneOrder(@Param('orderId') orderId: string) {
    if (!Number.isInteger(orderId) || +orderId <= 0) {
      throw new HttpException('유효하지 않은 주문 ID입니다.', 400);
    }

    const result: OneOrderDTO = await this.ordersService.getOneOrder(+orderId);

    return result;
  }
}
