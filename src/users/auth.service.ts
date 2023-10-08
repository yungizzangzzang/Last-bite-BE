import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService, // jwt 의존성 주입
    private configService: ConfigService, // env 파일 읽게 하기 위함.
  ) {}

  async signUp(body: CreateUserDto) {
    const { email, password, name, isClient, nickname } = body;
    if (
      !body.email ||
      !body.password ||
      !body.name ||
      !body.isClient ||
      !body.nickname
    ) {
      throw new BadRequestException({
        errorMessage: '데이터 형식이 잘못되었습니다.',
      });
    }

    const isExistEmailOrNickname = await this.prisma.users.findUnique({
      where: { email: email, nickname: nickname },
    });

    if (isExistEmailOrNickname) {
      if (isExistEmailOrNickname.email === email) {
        throw new ConflictException('이미 존재하는 이메일 입니다');
      }
      if (isExistEmailOrNickname.nickname === nickname) {
        throw new ConflictException('이미 존재하는 닉네임 입니다');
      }
    }

    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = this.prisma.users.create({
        data: { email, password: hashedPassword, name, isClient, nickname },
      });
      await user; // await 을 붙이지 않을 경우 save가 안되어도 return 메시지를 반환할 수 있는 문제 발생 예상.
      return { message: '회원가입 성공' };
    } catch (err) {
      throw new InternalServerErrorException({
        errorMessage: '회원가입에 실패하였습니다',
      });
    }
  }

  async login(body: LoginDto) {
    // body.email, body.password 만 체크하면 될 거 같음.
    if (!body.email || !body.password) {
      throw new BadRequestException({
        errorMessage: '데이터 형식이 잘못되었습니다.',
      });
    }
    const { email, password } = body;

    // 가입된 유저여야 합니다
    const user = await this.prisma.users.findUnique({
      where: { email: email },
    });

    if (!user) {
      throw new ForbiddenException({
        errorMessage: '이메일과 비밀번호를 확인해주세요',
      });
    }

    // 비밀번호가 일치해야 합니다
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      throw new ForbiddenException({
        errorMessage: '이메일과 비밀번호를 확인해주세요',
      });
    }
    try {
      const payload = { userId: user.userId };

      const accessToken = this.jwtService.sign(payload);
      return { accessToken: accessToken };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException({
        errorMessage: '로그인에 실패하였습니다',
      });
    }
  }
}
