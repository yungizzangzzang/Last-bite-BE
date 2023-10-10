import { PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ItemEntity } from '../entities/item.entity';

export class CreateItemDto extends PickType(ItemEntity, [
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
