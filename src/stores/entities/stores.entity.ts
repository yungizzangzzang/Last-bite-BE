import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class StoreEntity {
  @IsNumber()
  @IsNotEmpty()
  id!: number;

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
  createdAt!: Date;

  @IsDate()
  updatedAt!: Date | null;

  @IsDate()
  deletedAt!: Date | null;

  @IsNumber()
  ownerId!: number | null;
}
