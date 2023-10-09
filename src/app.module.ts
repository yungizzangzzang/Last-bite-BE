import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { AlarmsModule } from './alarms/alarms.module';
import { AuthService } from './users/auth.service';
import { CreateUserDto } from './users/dto/create-user.dto';
import { StoresModule } from './stores/stores.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.development' }),
    PrismaModule,
    UsersModule,
    AlarmsModule,
    StoresModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    UsersService,
    CreateUserDto,
    AuthService,
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(LoggerMiddleware).forRoutes('*');
  // }
}
