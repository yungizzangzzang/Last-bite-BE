import { PickType } from '@nestjs/swagger';
import { OrderEntity } from '../entities/order.entity';

export class CreateOrderDto extends PickType(OrderEntity, [
  'discount',
  'totalPrice'
]){
  name: string;

  imgUrl?: string | null;
}

export class UserOrdersDTO extends PickType(OrderEntity, [
  'orderId',
  'discount',
  'createdAt',
]) {
  
  storeId: number;

  storeName: string;

  // items: OrderItemForUserDTO[];

  star?: number | null;
}
