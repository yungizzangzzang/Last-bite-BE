import { PickType } from '@nestjs/mapped-types';
import { StoreEntity } from '../entities/stores.entity';

export class GetStoreDto extends PickType(StoreEntity, [
  'ownerId',
  'name',
  'longitude',
  'latitude',
  'address',
  'storePhoneNumber',
  'category',
] as const) {}
