import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject } from 'class-validator';

export class CreateOrderDtoResponse {
  @IsObject({ message: String })
  @IsNotEmpty()
  @ApiProperty({
    type: Object,
    description: '예약 생성 완료',
    example: '예약이 완료되었습니다.',
  })
  'message': string;
}
