import { ApiProperty } from '@nestjs/swagger';
import { Users } from '@prisma/client';
import { UserEntity } from './user.entity';

export class AuthEntity implements UserEntity {
  constructor(partial: Partial<AuthEntity>) {
    Object.assign(this, partial);
  }
  @ApiProperty()
  userId: number;

  @ApiProperty()
  isClient: boolean;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  point: number;

  @ApiProperty()
  nickname: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date | null;

  @ApiProperty()
  accessToken: string;
}
