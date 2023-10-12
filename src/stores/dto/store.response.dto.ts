import { ApiProperty, PickType } from '@nestjs/swagger';
import { CustomSuccessRes } from 'src/common/dto/response.dto';
import { GetItemDto } from 'src/items/dto/get-item.dto';
import { StoreEntity } from '../entities/stores.entity';

export class GetStoreResData extends PickType(StoreEntity, [
  'storeId',
  'ownerId',
  'name',
  'longitude',
  'latitude',
  'address',
  'storePhoneNumber',
  'category',
] as const) {}

export class GetAllStoresResDto extends CustomSuccessRes {
  @ApiProperty({ type: GetStoreResData, isArray: true })
  data: GetStoreResData[];
}

export class GetOneStoreResDto extends CustomSuccessRes {
  @ApiProperty()
  store: GetStoreResData;

  @ApiProperty({ type: GetItemDto, isArray: true })
  items: GetItemDto[];

  @ApiProperty()
  isLiked: boolean;
}
