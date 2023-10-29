import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReviewEntity {
  @ApiProperty({ description: '리뷰 ID' })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ description: '리뷰 내용' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: '별점 (1~5)' })
  @IsNumber()
  @IsNotEmpty()
  star: number;

  @ApiProperty({ description: '리뷰가 작성된 상점의 ID' })
  @IsNumber()
  @IsNotEmpty()
  storeId: number;

  @ApiProperty({ description: '리뷰를 작성한 사용자의 ID' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ description: '리뷰 생성 날짜' })
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @ApiProperty({ description: '리뷰 삭제 날짜', required: false })
  @IsDate()
  deletedAt: Date;
}
