import { PickType } from '@nestjs/mapped-types';
import { ItemEntity } from '../entities/item.entity';


export class CreateItemDto extends PickType(ItemEntity, [
  'name',
  'content',
  'prevPrice',
  'price',
  'count',
  'startTime',
  'endTime',
  'imgUrl',
] as const) {}
