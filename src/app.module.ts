import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AlarmsModule } from './alarms/alarms.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { UserCheckerMiddleware } from './common/middlewares/user-checker.middleware';
import { ItemsModule } from './items/items.module';
import { JobsModule } from './jobs/jobs.module';
import { LikesModule } from './likes/likes.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { OrdersModule } from './orders/orders.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { ReviewsModule } from './reviews/reviews.module';
import { StoreEntity } from './stores/entities/stores.entity';
import { StoresModule } from './stores/stores.module';
import { AuthController } from './users/auth/auth.controller';
import { AuthModule } from './users/auth/auth.module';
import { AuthService } from './users/auth/auth.service';
import { UserEntity } from './users/entities/user.entity';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.development',
    }),
    CacheModule.register(),
    EventEmitterModule.forRoot(),
    PrismaModule,
    AlarmsModule,
    StoresModule,
    ItemsModule,
    ReviewsModule,
    AuthModule,
    OrdersModule,
    OrderItemsModule,
    LikesModule,
    JobsModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, PrismaService, AuthService, StoreEntity, UserEntity],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer
      .apply(UserCheckerMiddleware)
      .forRoutes({ path: 'stores/:storeId', method: RequestMethod.GET });
  }
}
