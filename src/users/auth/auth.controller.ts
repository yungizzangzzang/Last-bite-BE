import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/auth/dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly createUserDto: CreateUserDto,
    private readonly updateUserDto: UpdateUserDto,
  ) {}

  @Post('/signup')
  @ApiTags('users')
  @ApiOperation({ summary: '회원가입', description: '유저를 생성합니다.' })
  @ApiCreatedResponse({ description: '회원가입' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
  })
  async signUp(@Res({ passthrough: true }) @Body() body: CreateUserDto) {
    console.log(body);

    return await this.authService.signUp(body);
  }

  // 유저 닉네임 중복검사
  @Get('signup')
  @ApiTags('users')
  async getNickname(@Req() req) {
    return await this.authService.signUp(req.query.nickname);
  }

  @Post('login')
  @ApiTags('users')
  @ApiOperation({
    summary: '로그인',
    description: 'Login을 진행합니다.',
  })
  @ApiCreatedResponse({ description: '로그인' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: LoginDto,
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
  })
  async login(
    @Request() req: any,
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(body);
    res.cookie('Authorization', result?.accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return result;
  }

  // 유저 로그아웃
  @Post('logout')
  async logOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
  }

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
    const currentUser = await this.authService.findOneUser(req.email);
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
      await this.authService.updateUser(req.nickname, req.user.userId);
    }
    if (updateUserDto.password && updateUserDto.password) {
      this.authService.updateUser(req.password, req.user.userId);
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
    return this.authService.removeUser(req.user);
  }
}
