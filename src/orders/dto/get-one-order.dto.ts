import { ApiProperty, PickType } from '@nestjs/swagger';
import { OrderEntity } from '../entities/order.entity';

export class OrderItemDetailDTO {
  @ApiProperty({ description: '주문한 상품명', example: '로제 떡볶이' })
  name: string;

  @ApiProperty({ type: Number, description: '주문한 수량', example: 1 })
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

  @ApiProperty({ description: '가게 이름', example: '종훈 떡볶이' })
  storeName: string;
}
