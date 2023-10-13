import { ApiProperty, PickType } from '@nestjs/swagger';
import { OrderItemEntity } from '../entities/order-item.entity';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

// OrdersItems 목록 조회 Dto, 주문 상세 하단 사용 (Order 정보 - OrdersItems - totalPrice)
export class GetOrderItemDto extends PickType(OrderItemEntity, [
  'count',
]) {
  // Items 테이블에서
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: '개별 메뉴 이름',
    example: '로제 떡볶이',
  })
  name: string;

  // Items 테이블에서
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    description: '개별 메뉴 1개 가격',
    example: '4000',
  })
  price: number;

  // price * count
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    description: '개별 메뉴 전체(주문수량) 가격',
    example: '8000',
  })
  totalPrice: number;
}
