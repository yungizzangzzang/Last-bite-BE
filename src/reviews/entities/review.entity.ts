import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReviewEntity {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  star: number;

  @IsNumber()
  @IsNotEmpty()
  storeId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsDate()
  deletedAt: Date;
}
