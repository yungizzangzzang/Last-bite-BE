import { PickType } from '@nestjs/swagger';
import { StoreEntity } from '../entities/stores.entity';

export class GetAllStoreWithInRadiusReqDto extends PickType(StoreEntity, [
  'longitude',
  'latitude',
] as const) {}

export class UpdateStoreReqDto extends PickType(StoreEntity, [
  'name',
  'storePhoneNumber',
  'category',
] as const) {}
