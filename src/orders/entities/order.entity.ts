import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class OrderEntity {
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @IsNumber()
  @IsNotEmpty()
  discount: number;

  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;

  @IsNumber()
  @IsNotEmpty()
  storeId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  reviewId: number;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;

  @IsDate()
  deletedAt: Date | null;
}
