import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from '../auth/dtos/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UpdateUserDto } from '../auth/dtos/update-user.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly createUserDto: CreateUserDto,
    private readonly updateUserDto: UpdateUserDto,
  ) {}

  // 유저 정보 불러오기
  @ApiBearerAuth('jwt')
  @Get('userinfo')
  @ApiTags('users')
  @ApiOperation({
    summary: '회원정보',
    description: '회원정보',
  })
  @ApiCreatedResponse({ description: '회원정보' })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
  })
  @UseGuards(JwtAuthGuard)
  async whoAmI(@Req() req) {
    const currentUser = await this.usersService.findOneUser(req.email);
    return currentUser;
  }

  // 유저 닉네임, 패스워드 수정
  @Put('userinfo')
  @ApiTags('users')
  @ApiOperation({
    summary: '회원정보 수정(닉네임, 비밀번호)',
    description: '회원정보 수정(닉네임, 비밀번호)',
  })
  @ApiCreatedResponse({ description: '회원정보' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
  })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  async updateUserInfo(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    if (updateUserDto.nickname) {
      await this.usersService.updateUser(req.nickname, req.user.userId);
    }
    if (updateUserDto.password && updateUserDto.password) {
      this.usersService.updateUser(req.password, req.user.userId);
    }
    if (
      !updateUserDto.nickname &&
      !updateUserDto.password &&
      !updateUserDto.password
    ) {
      throw new UnauthorizedException('입력된 값이 없습니다');
    }
    return { success: true, message: '수정성공' };
  }

  // 회원탈퇴
  @Delete('delete')
  @ApiTags('users')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Req() req): Promise<object> {
    return this.usersService.removeUser(req.user);
  }
}
