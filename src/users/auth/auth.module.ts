import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthController } from 'src/users/auth/auth.controller';
import { AuthService } from 'src/users/auth/auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
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
