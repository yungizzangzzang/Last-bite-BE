import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ItemEntity {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    description: 'itemId',
    example: '34',
  })
  itemId!: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: '메뉴 이름',
    example: '종훈 떡볶이',
  })
  name!: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({ type: Number, description: '기존 가격', example: 4000 })
  prevPrice!: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({ type: Number, description: '할인 가격', example: 3000 })
  price!: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({ type: Number, description: '할인 수량', example: 9 })
  count!: number;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ type: Number, description: '할인 시작 시간', example: 19 })
  startTime!: Date;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ type: Number, description: '할일 마감 시간', example: 21 })
  endTime!: Date;

  @IsString()
  @ApiProperty({
    type: String,
    description: '이미지 업로드',
    example: '얘는 제가 한번 이미지 업로드 해볼게용...!',
  })
  imgUrl!: string | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: '메뉴 설명',
    example: '요즘 대세 종훈 떡볶이',
  })
  content!: string;

  @IsNumber()
  @IsNotEmpty()
  storeId!: number;

  @IsDate()
  @IsNotEmpty()
  createdAt!: Date;

  @IsDate()
  @IsNotEmpty()
  updatedAt!: Date | null;

  @IsDate()
  deletedAt!: Date | null;
}
