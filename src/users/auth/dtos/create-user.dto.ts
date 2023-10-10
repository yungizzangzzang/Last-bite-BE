import { PickType } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';

export class CreateUserDto extends PickType(UserEntity, [
  'email',
  'password',
  'name',
  'isClient',
  'nickname',
] as const) {}
