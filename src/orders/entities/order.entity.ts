import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class OrderEntity {
  @ApiProperty({ description: '주문 ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @ApiProperty({ description: '할인율', example: 22 })
  @IsNumber()
  @IsNotEmpty()
  discount: number;

  @ApiProperty({ description: '총 주문 가격', example: 14000 })
  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;

  @ApiProperty({ description: '상점 ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  storeId: number;

  @ApiProperty({ description: '사용자 ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ description: '리뷰 ID', example: 4 })
  @IsNumber()
  @IsNotEmpty()
  reviewId: number;

  @ApiProperty({ description: '주문 생성 날짜' })
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @ApiProperty({ description: '주문 수정 날짜' })
  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;

  @ApiProperty({ description: '주문 삭제 날짜', required: false })
  @IsDate()
  deletedAt: Date | null;
}
