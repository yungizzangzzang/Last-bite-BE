import { ApiProperty } from '@nestjs/swagger';
import { Stores } from '@prisma/client';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class StoreEntity implements Stores {
  @ApiProperty({
    type: Number,
    example: 1,
    description: '가게를 소유한 유저의 id',
    nullable: true,
  })
  @IsNumber()
  ownerId!: number | null;

  @ApiProperty({
    type: Number,
    example: 1,
    description: '가게 id',
  })
  @IsNumber()
  @IsNotEmpty()
  storeId!: number;

  @ApiProperty({
    type: String,
    example: '만두분식',
    description: '가게 이름',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    type: Number,
    example: 37.2662777,
    description: '가게 위치의 경도 값',
  })
  @IsNumber()
  @IsNotEmpty()
  longitude!: number;

  @ApiProperty({
    type: Number,
    example: 126.9999999,
    description: '가게 위치의 위도 값',
  })
  @IsNumber()
  @IsNotEmpty()
  latitude!: number;

  @ApiProperty({
    type: String,
    example: '경기도 사랑시 고백구 행복대로 1234번길 56-7',
    description: '가게의 도로명 주소',
  })
  @IsString()
  @IsNotEmpty()
  address!: string;

  @ApiProperty({
    type: String,
    example: '031 1234567',
    description: '가게 연락처',
    nullable: true,
  })
  @IsString()
  storePhoneNumber!: string | null;

  @ApiProperty({
    type: String,
    example: '분식',
    description: '가게 종류',
  })
  @IsString()
  @IsNotEmpty()
  category!: string;

  @ApiProperty({
    type: String,
    example: '1234567-123-1234-12345',
    description: '가게 관리 번호',
  })
  @IsString()
  @IsNotEmpty()
  managementNumber!: string;

  @ApiProperty({
    type: Date,
    example: '2023-10-10 00:00:00.000',
    description: '가게 데이터 생성 날짜',
  })
  @IsDate()
  @IsNotEmpty()
  createdAt!: Date;

  @ApiProperty({
    type: Date,
    example: '2023-10-10 00:00:00.000',
    description: '가게 데이터 수정 날짜',
    nullable: true,
  })
  @IsDate()
  updatedAt!: Date | null;

  @ApiProperty({
    type: Date,
    example: '2023-10-10 00:00:00.000',
    description: '가게 데이터 삭제 날짜',
    nullable: true,
  })
  @IsDate()
  deletedAt!: Date | null;
}
