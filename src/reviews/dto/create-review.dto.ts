import { PickType } from '@nestjs/swagger';
import { ReviewEntity } from '../entities/review.entity';

export class CreateReviewDto extends PickType(ReviewEntity, [
  'content',
  'star',
] as const) {}
