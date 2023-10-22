import { PickType } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';

export class GettingPointsDto extends PickType(UserEntity, [
  'point',
] as const) {}
