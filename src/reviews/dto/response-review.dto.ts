import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ReviewEntity } from '../entities/review.entity';

export class ResponseReviewDto extends PickType(ReviewEntity, [
  'content',
  'star',
  'createdAt',
] as const) {
  @ApiProperty({ description: '닉네임' })
  @IsString()
  @IsNotEmpty()
  nickname: string;
}
