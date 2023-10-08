import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersService } from './users.service';
// import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
// import { CurrentUserMiddleware } from './middlewares/current-user.middleware';

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
  providers: [UsersService, CreateUserDto, AuthService],
  controllers: [UsersController],
})
export class UsersModule {
  // configure(consuemer: MiddlewareConsumer) {
  //   consuemer.apply(CurrentUserMiddleware).forRoutes('*');
  // }
}
