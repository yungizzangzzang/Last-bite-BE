import { PickType } from '@nestjs/mapped-types';
import { StoreEntity } from '../entities/stores.entity';

export class UpdateStoreDto extends PickType(StoreEntity, [
  'name',
  'storePhoneNumber',
  'category',
] as const) {}
