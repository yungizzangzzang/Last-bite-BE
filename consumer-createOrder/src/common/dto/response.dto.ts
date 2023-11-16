import { ApiProperty } from '@nestjs/swagger';

export abstract class CustomSuccessRes {
  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'API 성공 호출 여부',
  })
  success: boolean;
}
