import { ApiProperty } from '@nestjs/swagger';
import { Users } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserEntity implements Users {
  @IsNotEmpty({ message: '이메일은 필수 입력값입니다.' })
  @IsEmail()
  @IsString()
  @IsString()
  @ApiProperty({ type: String, description: 'email', example: 'asdf@asdf.com' })
  email: string;

  @IsNotEmpty({ message: '비밀번호는 필수 입력값입니다.' })
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

  
  @IsNotEmpty({ message: '이름은 필수 입력값입니다.' })
  @IsString()
  @MinLength(1, { message: '최소 1글자 이상은 입력해주세용' })
  @MaxLength(20, { message: '20자 이하로 입력해주세요' })
  @ApiProperty({ type: String, description: '이름', example: 'Dcafrio' })
  name: string;

  @IsBoolean()
  @ApiProperty({ type: Boolean, description: '고객/사장', example: true })
  isClient: boolean;

  @IsNotEmpty({ message: '닉네임은 필수 입력값입니다.' })
  @IsString()
  @MinLength(2, { message: '2자 이상을 입력해주세요' })
  @MaxLength(20, { message: '20자 이하를 입력해주세요' })
  @ApiProperty({ type: String, description: '닉네임', example: 'nickname' })
  nickname: string;

  @IsNotEmpty({ message: '정확하게 입력해주세요' })
  @IsNumber()
  @ApiProperty({ type: Number, description: '포인트', example: 5000 })
  point: number;

  userId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  accessToken: string;
}
