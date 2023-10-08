import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class UsersController {
  constructor(readonly authService: AuthService) {}

  @ApiOperation({ summary: '유저 생성 API', description: '유저를 생성합니다.' })
  @Post('/signup')
  async signUp(@Body() body: CreateUserDto) {
    return await this.authService.signUp(body);
  }

  @ApiOperation({
    summary: '유저 Login API',
    description: 'Login을 진행합니다.',
  })
  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const { accessToken } = await this.authService.login(body);
    res.cookie('Authorization', accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    return res.json({ accessToken });
  }
}
