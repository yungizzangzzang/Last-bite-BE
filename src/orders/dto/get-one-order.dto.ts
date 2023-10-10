import { ApiProperty, PickType } from '@nestjs/swagger';
import { OrderEntity } from '../entities/order.entity';

export class OrderItemDetailDTO {
  @ApiProperty({ description: '주문한 상품명' })
  name: string;

  @ApiProperty({ description: '주문한 수량' })
  count: number;
}

export class OneOrderDTO extends PickType(OrderEntity, [
  'orderId',
  'totalPrice',
  'discount',
  'createdAt',
]) {
  @ApiProperty({ type: [OrderItemDetailDTO], description: '주문한 항목' })
  items: OrderItemDetailDTO[];

  @ApiProperty({ description: '가게 이름' })
  storeName: string;
}
