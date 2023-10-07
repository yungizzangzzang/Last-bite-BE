import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const existedUser = await this.prisma.users.findUnique({
      where: { email: createUserDto.email },
    });

    if (existedUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;

    return await this.prisma.users.create({ data: createUserDto });
  }

  findAllUsers() {
    return this.prisma.users.findMany();
  }

  async findOne(id: number) {
    const user = await this.prisma.users.findUnique({ where: { userId: id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcypt.hash(updateUserDto.password, 10);
    }

    const user = await this.prisma.users.findUnique({ where: { userId: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.prisma.users.update({
      where: { userId: id },
      data: {
        name: updateUserDto.name,
        password: updateUserDto.password,
        email: updateUserDto.email,
      },
    });
  }

  async remove(id: number) {
    const user = await this.prisma.users.findUnique({ where: { userId: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.prisma.users.delete({ where: { userId: id } });
  }
}
