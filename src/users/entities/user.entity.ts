import { ApiProperty } from '@nestjs/swagger';
import { Users } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserEntity implements Users {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @IsString()
  @ApiProperty({ type: String, description: 'email', example: 'asdf@asdf.com' })
  email: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(4, { message: '4자이상을 입력해주세요' })
  @MaxLength(8, { message: '8자 이하를 입력해주세요' })
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: '비밀번호를 영어와 숫자로만 만들어주세요 ',
  })
  @ApiProperty({
    type: String,
    description: '비밀번호',
    example: '1q2w',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1, { message: '최소 1글자 이상은 입력해주세용' })
  @MaxLength(20, { message: '20자 이하로 입력해주세요' })
  @ApiProperty({ type: String, description: '이름', example: 'Dcafrio' })
  name: string;

  @IsNotEmpty()
  @IsBoolean({ message: '유저, 사장 중 하나를 선택해주세요.' })
  @ApiProperty({ type: Boolean, description: '고객/사장', example: true })
  isClient: boolean;

  @IsNotEmpty()
  @IsString()
  @MinLength(2, { message: '2자 이상을 입력해주세요' })
  @MaxLength(20, { message: '20자 이하를 입력해주세요' })
  @ApiProperty({ type: String, description: '닉네임', example: 'nickname' })
  nickname: string;

  userId: number;
  point: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  @ApiProperty()
  accessToken: string;
}
