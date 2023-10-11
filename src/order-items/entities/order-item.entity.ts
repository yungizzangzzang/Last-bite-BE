import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class OrderItemEntity {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    description: 'orderItemId',
    example: '21',
  })
  orderItemId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    description: '개별 메뉴 Id',
    example: '21',
  })
  itemId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    description: '개별 메뉴 예약 수량',
    example: '2',
  })
  count: number;


  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    description: '예약 번호',
    example: '42',
  })
  orderId: number;
 
  @IsDate()
  @IsNotEmpty()
  createdAt!: Date;

  @IsDate()
  @IsNotEmpty()
  updatedAt!: Date | null;

  @IsDate()
  deletedAt!: Date | null;
}