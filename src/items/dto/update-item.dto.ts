import { PickType } from '@nestjs/mapped-types';
import { ItemEntity } from '../entities/item.entity';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateItemDto extends PickType(ItemEntity, [
  'name',
  'content',
  'prevPrice',
  'price',
  'count',
  'imgUrl',
] as const) {
  @IsNumber()
  @IsNotEmpty()
  startTime!: number;

  @IsNumber()
  @IsNotEmpty()
  endTime!: number;
}
