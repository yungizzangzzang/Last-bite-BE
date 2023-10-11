import { ApiProperty, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ItemEntity } from '../entities/item.entity';
export class CreateItemDto extends PickType(ItemEntity, [
  'name',
  'content',
  'prevPrice',
  'price',
  'count',
  // 'imgUrl',
] as const) {
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({
    type: Number,
    description: '할인 시작 시간',
    example: '19',
  })
  startTime!: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({
    type: Number,
    description: '할인 마감 시간',
    example: '21',
  })
  endTime!: number;
}
