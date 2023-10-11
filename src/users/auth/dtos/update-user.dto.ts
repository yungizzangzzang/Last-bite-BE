import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, Matches, MaxLength, MinLength } from 'class-validator';
import { UserEntity } from 'src/users/entities/user.entity';

export class UpdateUserDto extends PartialType(UserEntity) {
  @IsOptional()
  @MinLength(1, { message: '1자 이상을 입력해주세요' })
  @MaxLength(8, { message: '8자 이하를 입력해주세요' })
  @ApiProperty({ type: String, description: '닉네임', example: 'nickname' })
  nickname?: string | undefined;

  @IsOptional()
  @MinLength(4, { message: '4자이상을 입력해주세요' })
  @MaxLength(8, { message: '8자 이하를 입력해주세요' })
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: '영어와 숫자로만 만들어주세요 ',
  })
  @ApiProperty({
    type: String,
    description: '비밀번호',
    example: '1q2w3e4r',
  })
  password?: string;
}
