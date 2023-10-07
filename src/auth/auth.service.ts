import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { PrismaService } from 'src/prisma/prisma.service';
  import { AuthEntity } from './entity/auth.entity';
  
  @Injectable()
  export class AuthService {
    constructor(
      private prisma: PrismaService,
      private jwtServcie: JwtService,
    ) {}
  
    async login(email: string, password: string): Promise<AuthEntity> {
      // Fetch a user with the given email
      const user = await this.prisma.users.findUnique({
        where: { email },
      });
  
      // If noe user is found, throw an error
      if (!user) {
        throw new NotFoundException('No user found for email: ${email}');
      }
  
      // Check if the password is correct
      const isPasswordValid = user.password === password;
  
      // If password does not match, throw an error
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }
  
      return {
        accessToken: this.jwtServcie.sign({ userId: user.userId }),
      };
    }
  }
  