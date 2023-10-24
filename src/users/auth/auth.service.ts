import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/users/auth/dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { GettingPointsDto } from './dtos/points.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async signUp(body: CreateUserDto) {
    try {
      const { email, password, name, isClient, nickname, managementNumber } =
        body;

      if (!email || !password || !name || !nickname) {
        throw new BadRequestException({
          errorMessage: '데이터 형식이 잘못되었습니다.',
        });
      }

      const isExistEmail = await this.prisma.users.findUnique({
        where: { email },
      });
      const isExistNickname = await this.prisma.users.findUnique({
        where: { nickname },
      });

      if (isExistEmail || isExistNickname) {
        throw new ConflictException('이미 존재하는 이메일 or 닉네임 입니다');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('여기:', email, name, isClient, nickname);

      const user = await this.prisma.users.create({
        data: {
          email,
          password: hashedPassword,
          name,
          isClient,
          nickname,
        },
      });
      console.log('user:', user);
      console.log('management:', managementNumber);

      if (isClient === false && !managementNumber) {
        // 사장인데, 관리번호 입력안하면 빠꾸
        throw new BadRequestException({
          errorMessage: '관리자 번호를 입력해주세요',
        });
      }
      if (isClient === false && managementNumber) {
        // 사장인데, 관리번호 입력안하면 빠꾸
        const store = await this.prisma.stores.update({
          where: { managementNumber },
          data: {
            ownerId: user.userId,
          },
        });
        console.log(store);
      }

      return { message: '회원가입 성공, 가즈아!!' };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException({
        errorMessage: '회원가입에 실패하였습니다',
      });
    }
  }

  async login(body: LoginDto) {
    if (!body.email || !body.password) {
      throw new BadRequestException({
        errorMessage: '데이터 형식이 잘못되었습니다.',
      });
    }
    const { email, password } = body;

    // 가입된 유저여야 합니다
    const user: {
      userId: number;
      nickname: string;
      password?: string | undefined;
      isClient: boolean;
      email: string;
    } | null = await this.prisma.users.findUnique({
      where: { email },
      select: {
        userId: true,
        nickname: true,
        password: true,
        isClient: true,
        name: true,
        email: true,
      },
    });

    console.log(user);

    if (!user) {
      throw new ForbiddenException({
        errorMessage: '이메일과 비밀번호를 확인해주세요',
      });
    }

    // 비밀번호가 일치해야 합니다
    const isPasswordMatched = await bcrypt.compare(password, user.password!);
    if (!isPasswordMatched) {
      throw new ForbiddenException({
        errorMessage: '이메일과 비밀번호를 확인해주세요',
      });
    }
    delete user.password;
    try {
      const payload = { user };
      const accessToken = this.jwtService.sign(payload, {
        expiresIn: '24h',
        secret: process.env.ACCESS_SECRET_KEY,
      });

      return { accessToken, user, message: '가봅시다' };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException({
        errorMessage: '로그인에 실패하였습니다',
      });
    }
  }

  async findOneUser(userId: number) {
    console.log('dfdf', userId);

    const user = await this.prisma.users.findFirst({
      where: { userId },
    });
    console.log(user);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async pointAccumulation(user: any, body: GettingPointsDto) {
    const beforeUser: any = await this.prisma.users.findUnique({
      where: { userId: user.userId },
    });
    console.log('beforePoint: ', beforeUser.point);
    const updatedUser = await this.prisma.users.update({
      where: { userId: user.userId },
      data: {
        point: {
          increment: body.point,
        },
      },
    });
    console.log('업데이트된 point정보', updatedUser.point);
  }
}
