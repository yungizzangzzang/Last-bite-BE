import { ApiProperty } from '@nestjs/swagger';
import { Likes } from '@prisma/client';

export class LikeEntity implements Likes {
  @ApiProperty({
    type: Number,
    example: 1,
    description: '단골가게 id',
  })
  likeId: number;

  @ApiProperty({
    type: Date,
    example: '2023-10-10 00:00:00.000',
    description: '단골가게 생성 날짜',
  })
  createdAt: Date;

  @ApiProperty({
    type: Number,
    example: 1,
    description: '유저 id',
  })
  userId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: '가게 id',
  })
  storeId: number;
}
