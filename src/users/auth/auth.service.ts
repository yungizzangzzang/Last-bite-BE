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
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async signUp(body: CreateUserDto): Promise<void> {
    const { email, password, name, isClient, nickname } = body;
    if (!email || !password || !name || !isClient || !nickname) {
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
      // const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.prisma.users.create({
        data: {
          email,
          password: hashedPassword,
          name,
          isClient,
          nickname,
        },
      });

      // return { message: '회원가입 성공' };
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
        expiresIn: '5m',
        secret: process.env.ACCESS_SECRET_KEY,
      });

      return { accessToken, user };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException({
        errorMessage: '로그인에 실패하였습니다',
      });
    }
  }

  async findOneUser(userId: number) {
    console.log(userId);

    const user = await this.prisma.users.findFirst({
      where: { userId },
    });
    console.log(user);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(id: number, password: string, updateUserDto: UpdateUserDto) {
    if (password) {
      password = await bcrypt.hash(password, 10);
    }

    const user = await this.prisma.users.findFirst({ where: { userId: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.prisma.users.update({
      where: { userId: id },
      data: {
        password: updateUserDto.password,
        nickname: updateUserDto.nickname,
      },
    });
  }
  async removeUser(id: number) {
    const user = await this.prisma.users.findUnique({ where: { userId: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.prisma.users.delete({ where: { userId: id } });
  }
}
