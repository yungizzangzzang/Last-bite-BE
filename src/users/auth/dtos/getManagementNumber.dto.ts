import { PickType } from '@nestjs/swagger';
import { StoreEntity } from 'src/stores/entities/stores.entity';

export class GetManagementNumberDto extends PickType(StoreEntity, [
  'managementNumber',
] as const) {}
