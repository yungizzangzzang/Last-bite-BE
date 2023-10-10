import { PickType } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';
import { OrderEntity } from '../entities/order.entity';

export class OrderItemForUserDTO {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  imgUrl?: string | null;
}

export class UserOrdersDTO extends PickType(OrderEntity, [
  'orderId',
  'discount',
  'createdAt',
]) {
  @IsInt()
  storeId: number;

  @IsString()
  storeName: string;

  @IsArray()
  items: OrderItemForUserDTO[];

  @IsOptional()
  @IsInt()
  star?: number | null;
}
