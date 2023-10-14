import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StoreEntity } from 'src/stores/entities/stores.entity';
import { AuthController } from 'src/users/auth/auth.controller';
import { AuthService } from 'src/users/auth/auth.service';
import { UserEntity } from '../entities/user.entity';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: process.env.ACCESS_SECRET_KEY,
      signOptions: { expiresIn: '24h' },
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false,
    }),
  ],
  providers: [AuthService, JwtStrategy, StoreEntity, UserEntity],
  controllers: [AuthController],
  exports: [AuthService, PassportModule],
})
export class AuthModule {}
