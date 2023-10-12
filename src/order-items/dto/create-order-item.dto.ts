import { PickType } from '@nestjs/swagger';
import { OrderItemEntity } from '../entities/order-item.entity';

// ordersItems 생성 Dto, 장바구니에서 정보 받아오기
export class CreateOrderItemDto extends PickType(OrderItemEntity, [
  'itemId',
  'count',
]) {}
