import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Users } from '@prisma/client';
import { Response } from 'express';
import { User } from 'src/common/decorators/user.decorator';
import { CreateUserDto } from 'src/users/auth/dtos/create-user.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { GettingPointsDto } from './dtos/points.dto';

@ApiTags('authentication')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 회원가입
  @Post('/signup')
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
  async signUp(
    @Res({ passthrough: true }) response: Response,
    @Body() body: CreateUserDto,
  ) {
    return await this.authService.signUp(body);
  }

  // 로그인
  @Post('signin')
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
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return result;
  }

  // 포인트 충전
  @Post('point')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({
    summary: '포인트 충전',
    description: '포인트 충전',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: GettingPointsDto,
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
  })
  async pointAccumulation(
    // @Res({ passthrough: true }) res: Response,
    @Body() body: GettingPointsDto,
    @User() user: Users,
  ) {
    // console.log('point', body.point);
    // console.log('user', user);
    const points = await this.authService.pointAccumulation(user, body);

    return points;
  }

  // 유저 로그아웃
  @Post('logout')
  @ApiOperation({
    summary: '로그아웃',
    description: ' 로그아웃',
  })
  async logOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
  }

  // 유저 정보 불러오기
  @Get('user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
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
  async whoAmI(@Req() req) {
    console.log(req);

    const currentUser = await this.authService.findOneUser(req.user.userId);
    return currentUser;
  }
}
