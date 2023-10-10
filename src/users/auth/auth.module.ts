import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthService } from 'src/users/auth/auth.service';
import { AuthController } from 'src/users/auth/auth.controller';
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
  providers: [CreateUserDto, AuthService, UpdateUserDto],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
