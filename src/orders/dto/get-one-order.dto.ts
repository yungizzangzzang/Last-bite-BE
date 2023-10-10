import { PickType } from '@nestjs/swagger';
import { IsArray, IsInt, IsString } from 'class-validator';
import { OrderEntity } from '../entities/order.entity';

export class OrderItemDetailDTO {
  @IsString()
  name: string;

  @IsInt()
  count: number;
}

export class OneOrderDTO extends PickType(OrderEntity, [
  'orderId',
  'totalPrice',
  'discount',
  'createdAt',
]) {
  @IsArray()
  items: OrderItemDetailDTO[];

  @IsString()
  storeName: string;
}
