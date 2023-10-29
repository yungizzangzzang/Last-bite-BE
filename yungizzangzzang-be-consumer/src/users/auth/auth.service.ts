import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async findOneUser(userId: number) {
    const user = await this.prisma.users.findFirst({
      where: { userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
