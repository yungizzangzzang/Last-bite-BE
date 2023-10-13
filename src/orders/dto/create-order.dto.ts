import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { CreateOrderItemDto } from 'src/order-items/dto/create-order-item.dto';
import { OrderEntity } from '../entities/order.entity';

// orders 생성 Dto, 장바구니에서 정보 받아오기
export class CreateOrderOrderItemDto extends PickType(OrderEntity, [
  'discount',
  'storeId',
  'totalPrice',
]) {
  @ApiProperty({ type: [CreateOrderItemDto], description: '주문 항목' })
  @IsArray()
  items: CreateOrderItemDto[];
}

export class CreateOrderDto extends PickType(OrderEntity, [
  'userId',
  'discount',
  'storeId',
  'totalPrice',
  'orderId'
]) {
}
