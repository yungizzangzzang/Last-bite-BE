import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class StoreEntity {
  @IsNumber()
  @IsNotEmpty()
  id!: number;

  @IsNumber()
  ownerId!: number | null;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @IsNotEmpty()
  longitude!: number;

  @IsNumber()
  @IsNotEmpty()
  latitude!: number;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsString()
  storePhoneNumber!: string | null;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsString()
  @IsNotEmpty()
  managementNumber!: string;

  @IsDate()
  @IsNotEmpty()
  createdAt!: string;

  @IsDate()
  @IsNotEmpty()
  updatedAt!: string | null;

  @IsDate()
  deletedAt!: string | null;
}

