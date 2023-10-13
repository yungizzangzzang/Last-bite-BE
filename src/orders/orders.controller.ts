import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Users } from '@prisma/client';
import { User } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/users/guards/jwt.guard';
import { CreateOrderOrderItemDto } from './dto/create-order.dto';
import { OneOrderDTO } from './dto/get-one-order.dto';
import { UserOrdersDTO } from './dto/get-user-orders.dto';
import { CreateOrderDtoResponse } from './dto/order-response.dto';
import { OrdersService } from './orders.service';
import { CreateOrderItemDto } from 'src/order-items/dto/create-order-item.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: '주문 생성, orderItems 생성' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: CreateOrderDtoResponse,
  })
  @UseGuards(JwtAuthGuard)
  async createOrder(
    @Body() createOrderOrderItemDto: CreateOrderOrderItemDto,
    @User() user: Users,
  ): Promise<{ message: string }> {
    //기업 회원(isclient===true)이 접근한 경우
    if (user.isClient !== false) {
      throw new HttpException(
        { message: '일반 회원만 예약이 가능합니다.' },
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.ordersService.createOrder(createOrderOrderItemDto, user.userId);
  }

  @Get()
  @ApiOperation({ summary: '사용자의 모든 주문 조회' })
  @ApiOkResponse({ type: [UserOrdersDTO], description: '사용자의 주문 목록' })
  async getUserOrders(@User() user): Promise<UserOrdersDTO[]> {
    const { userId } = user;
    const result: UserOrdersDTO[] = await this.ordersService.getUserOrders(
      userId,
    );

    return result;
  }

  @Get(':orderId')
  @ApiOperation({ summary: '특정 주문 조회' })
  @ApiOkResponse({ type: OneOrderDTO, description: '특정 주문의 상세 정보' })
  async getOneOrder(@Param('orderId') orderId: string): Promise<OneOrderDTO> {
    if (!Number.isInteger(orderId) || +orderId <= 0) {
      throw new HttpException('유효하지 않은 주문 ID입니다.', 400);
    }

    const result: OneOrderDTO = await this.ordersService.getOneOrder(+orderId);

    return result;
  }
}
