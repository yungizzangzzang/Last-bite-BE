import { Body, Controller, Get, Post, Req, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

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

    return res.json(result);
  }

  // 유저 로그아웃
  @Post('logout')
  async logOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
  }
}
