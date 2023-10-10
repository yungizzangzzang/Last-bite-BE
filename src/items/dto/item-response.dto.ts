import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject } from 'class-validator';

export class CreateItemDtoResponse {
  @IsObject({ message: String })
  @IsNotEmpty()
  @ApiProperty({
    type: Object,
    description: '핫딜 생성 완료',
    example: '핫딜 생성이 완료되었습니다.'
  })
  "message": string
}

export class UpdateItemDtoResponse {
  @IsObject({ message: String })
  @IsNotEmpty()
  @ApiProperty({
    type: Object,
    description: '핫딜 수정 완료',
    example: '핫딜 수정이 완료되었습니다.'
  })
  "message": string
}

export class DeleteItemDtoResponse {
  @IsObject({ message: String })
  @IsNotEmpty()
  @ApiProperty({
    type: Object,
    description: '핫딜 생성 완료',
    example: '핫딜 삭제가 완료되었습니다.'
  })
  "message": string
}