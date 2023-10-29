import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AlarmsModule } from './alarms/alarms.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { UserCheckerMiddleware } from './common/middlewares/user-checker.middleware';
import { ItemsModule } from './items/items.module';
import { LikesModule } from './likes/likes.module';
import { MetricsController } from './metrics/metrics.controller';
import { OrderItemsModule } from './order-items/order-items.module';
import { OrdersModule } from './orders/orders.module';
// import { OrdersProcessor } from './orders/orders.processor';
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
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // BullModule.forRoot({
    //   redis: {
    //     host: process.env.REDIS_HOST,
    //     port: 6379,
    //   },
    // }),
    // CacheModule.register(),
    // EventEmitterModule.forRoot(),
    PrismaModule,
    AlarmsModule,
    StoresModule,
    ItemsModule,
    ReviewsModule,
    AuthModule,
    OrdersModule,
    OrderItemsModule,
    LikesModule,
  ],
  controllers: [AppController, AuthController, MetricsController],
  providers: [
    AppService,
    PrismaService,
    AuthService,
    StoreEntity,
    UserEntity,
    // OrdersProcessor,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer
      .apply(UserCheckerMiddleware)
      .forRoutes({ path: 'stores/:storeId', method: RequestMethod.GET });
  }
}
