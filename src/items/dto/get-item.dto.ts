import { PickType } from '@nestjs/mapped-types';
import { ItemEntity } from '../entities/item.entity';

export class GetItemDto extends PickType(ItemEntity, [
  'itemId',
  'name',
  'content',
  'prevPrice',
  'price',
  'count',
  'startTime',
  'endTime',
  'imgUrl',
  'deletedAt',
  'version',
] as const) {}
