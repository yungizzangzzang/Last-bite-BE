import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { StoreEntity } from 'src/stores/entities/stores.entity';
import { UserEntity } from 'src/users/entities/user.entity';

export class CreateUserDto
  extends PickType(UserEntity, [
    'email',
    'password',
    'name',
    'isClient',
    'nickname',
    'userId',
  ] as const)
  implements StoreEntity
{
  id: number;
  longitude: number;
  latitude: number;
  address: string;
  storePhoneNumber: string | null;
  category: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
  storeId: number;

  // @IsNumber()
  ownerId: number | null;

  @ApiProperty({ type: String, description: '사업자 번호', example: '434-343' })
  @IsString()
  @IsOptional()
  managementNumber: string;
}
