import { ApiProperty, PickType } from '@nestjs/swagger';
import { OrderEntity } from '../entities/order.entity';

export class OrderItemForUserDTO {
  @ApiProperty({ description: '주문한 상품 이름' })
  name: string;

  @ApiProperty({ description: '상품 이미지 URL', required: false })
  imgUrl?: string | null;
}

export class UserOrdersDTO extends PickType(OrderEntity, [
  'orderId',
  'discount',
  'createdAt',
]) {
  @ApiProperty({ description: '가게 ID' })
  storeId: number;

  @ApiProperty({ description: '가게 이름' })
  storeName: string;

  @ApiProperty({ type: [OrderItemForUserDTO], description: '주문한 항목들' })
  items: OrderItemForUserDTO[];

  @ApiProperty({ description: '별점', required: false })
  star?: number | null;
}
