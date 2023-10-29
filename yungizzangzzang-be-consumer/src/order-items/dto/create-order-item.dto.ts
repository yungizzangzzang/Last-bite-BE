import { PickType } from '@nestjs/swagger';
import { OrderItemEntity } from '../entities/order-item.entity';

export class CreateOrderItemDto extends PickType(OrderItemEntity, [
  'orderId',
  'itemId',
  'count',
]) {}
