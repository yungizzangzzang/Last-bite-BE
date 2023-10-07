import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class StoreEntity {
  @IsNumber()
  @IsNotEmpty()
  id: number | undefined;

  @IsNumber()
  OwnerId: number | undefined;

  @IsString()
  @IsNotEmpty()
  name: string | undefined;

  @IsNumber()
  @IsNotEmpty()
  longitude: number | undefined;

  @IsNumber()
  @IsNotEmpty()
  latitude: number | undefined;

  @IsString()
  @IsNotEmpty()
  address: string | undefined;

  @IsString()
  storePhoneNumber: string | undefined;

  @IsString()
  @IsNotEmpty()
  category: string | undefined;

  @IsString()
  @IsNotEmpty()
  managementNumber: string | undefined;

  @IsDate()
  @IsNotEmpty()
  createdAt: string | undefined;

  @IsDate()
  @IsNotEmpty()
  updatedAt: string | undefined;

  @IsDate()
  deletedAt: string | undefined;

  @IsString()
  @IsNotEmpty()
  closeTime: string | undefined;
}
