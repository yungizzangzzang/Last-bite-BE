import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersService } from './users.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CreateUserDto } from '../auth/dtos/create-user.dto';
import { UsersController } from './users.controller';
import { UpdateUserDto } from '../auth/dtos/update-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { AuthController } from 'src/auth/auth.controller';
export const jwtSecret = process.env.JWT_SECRET;
@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: jwtSecret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [UsersService, CreateUserDto, AuthService, UpdateUserDto],
  controllers: [AuthController, UsersController],
})
export class UsersModule {}
