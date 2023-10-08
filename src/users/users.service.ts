import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private createUserDto: CreateUserDto,
  ) {}

  createUser(createUserDto: CreateUserDto) {
    const user = this.prisma.users.create({  data: createUserDto });
    return user;
  }

  findAllUsers() {
    return this.prisma.users.findMany();
  }

  async findOneUser(email: string) {
    const user = await this.prisma.users.findUnique({
      where: { email: email },
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
