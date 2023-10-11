import { PickType } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';

export class CreateUserDto extends PickType(UserEntity, [
  'email',
  'password',
  'name',
  'isClient',
  'nickname',
] as const) {}

// @IsNotEmpty()
// @IsEmail()
// @IsString()
// @ApiProperty({ type: String, description: 'email', example: 'asdf@asdf.com' })
// email: string;

// @IsNotEmpty()
// @MinLength(4, { message: '4자이상을 입력해주세요' })
// @MaxLength(20, { message: '20자 이하를 입력해주세요' })
// @Matches(/^[a-zA-Z0-9]*$/, {
//   message: '비밀번호를 영어와 숫자로만 만들어주세요 ',
// })
// @ApiProperty({
//   type: String,
//   description: '비밀번호',
//   example: '1q2w3e4r',
// })
// password: string;

// @IsNotEmpty()
// @IsString()
// @MinLength(1, { message: '최소 1글자 이상은 입력해주세용' })
// @MaxLength(20, { message: '20자 이하로 입력해주세요' })
// @ApiProperty({ type: String, description: '이름', example: 'Dcafrio' })
// name: string;

// @IsNotEmpty()
// @IsBoolean({ message: '유저, 사장 중 하나를 선택해주세요.' })
// @ApiProperty({ type: Boolean, description: '고객/사장', example: true })
// isClient: boolean;

// @IsNotEmpty()
// @MinLength(2, { message: '2자 이상을 입력해주세요' })
// @MaxLength(20, { message: '20자 이하를 입력해주세요' })
// @ApiProperty({ type: String, description: '닉네임', example: 'nickname' })
// nickname: string;
