import { ApiProperty, PickType } from '@nestjs/swagger';
import { OrderEntity } from '../entities/order.entity';

export class OrderItemForUserDTO {
  @ApiProperty({ description: '주문한 상품 이름', example: '로제 떡볶이' })
  name: string;

  @ApiProperty({
    description: '상품 이미지 URL',
    required: false,
    example:
      'https://mys3image.s3.ap-northeast-2.amazonaws.com/1695777107743_original-6412cab88963b9b720f9f5e7e76e297c.jpg',
  })
  imgUrl?: string | null;
}

export class UserOrdersDTO extends PickType(OrderEntity, [
  'orderId',
  'discount',
  'createdAt',
]) {
  @ApiProperty({ description: '가게 ID', example: 1 })
  storeId: number;

  @ApiProperty({ description: '가게 이름', example: '종훈 떡볶이' })
  storeName: string;

  @ApiProperty({ type: [OrderItemForUserDTO], description: '주문한 항목들' })
  items: OrderItemForUserDTO[];

  @ApiProperty({ description: '별점', required: false, example: 2 })
  star?: number | null;
}
