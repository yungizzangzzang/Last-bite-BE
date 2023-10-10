import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/users/auth/dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class AuthService {
  verify(jwtString: string) {
    throw new Error('Method not implemented.');
  }
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService, // jwt 의존성 주입
    private configService: ConfigService, // env 파일 읽게 하기 위함.
  ) {}

  async signUp(body: CreateUserDto) {
    console.log(body);

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

    console.log('1234', body);

    try {
      // const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword);

      const user = await this.prisma.users.create({
        data: { email, password: hashedPassword, name, isClient, nickname },
      });

      return { message: '회원가입 성공' };
    } catch (err) {
      console.error(err);

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
    const user: {
      userId: number;
      nickname: string;
      password?: string | undefined;
      isClient: boolean;
    } | null = await this.prisma.users.findUnique({
      where: { email },
      select: {
        userId: true,
        nickname: true,
        password: true,
        isClient: true,
        name: true,
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

  createUser(createUserDto: CreateUserDto) {
    const user = this.prisma.users.create({ data: createUserDto });
    return user;
  }

  async findOneUser(email: string) {
    const user = await this.prisma.users.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.prisma.users.findUnique({ where: { email: email } });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const user = await this.prisma.users.findUnique({ where: { userId: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.prisma.users.update({
      where: { userId: id },
      data: {
        email: updateUserDto.email,
        password: updateUserDto.password,
        name: updateUserDto.name,
        isClient: updateUserDto.isClient,
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
