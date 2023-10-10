import { ApiProperty, PickType } from '@nestjs/swagger';
import { ReviewEntity } from '../entities/review.entity';

export class ResponseReviewDto extends PickType(ReviewEntity, [
  'content',
  'star',
  'createdAt',
] as const) {
  @ApiProperty({ description: '닉네임' })
  nickname: string;
}
