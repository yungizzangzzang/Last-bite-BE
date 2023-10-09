import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ItemEntity {
  @IsNumber()
  @IsNotEmpty()
  itemId!: number;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @IsNotEmpty()
  prevPrice!: number;

  @IsNumber()
  @IsNotEmpty()
  price!: number;

  @IsNumber()
  @IsNotEmpty()
  count!: number;

  @IsDate()
  @IsNotEmpty()
  startTime!: Date;

  @IsDate()
  @IsNotEmpty()
  endTime!: Date;

  @IsString()
  imgUrl!: string | null;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsNumber()
  @IsNotEmpty()
  storeId!: number;
}
