import { PickType } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';

export class LoginDto extends PickType(UserEntity, [
  'email',
  'password' as const,
]) {}
