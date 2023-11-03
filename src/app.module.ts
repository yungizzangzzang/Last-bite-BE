import { Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AlarmsModule } from './alarms/alarms.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserCheckerMiddleware } from './common/middlewares/user-checker.middleware';
import { ItemsModule } from './items/items.module';
import { LikesModule } from './likes/likes.module';
import { MetricsController } from './metrics/metrics.controller';
import { OrderItemsModule } from './order-items/order-items.module';
import { OrdersModule } from './orders/orders.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { ReviewsModule } from './reviews/reviews.module';
import { StoresModule } from './stores/stores.module';
import { AuthController } from './users/auth/auth.controller';
import { AuthModule } from './users/auth/auth.module';
import { AuthService } from './users/auth/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
  providers: [AppService, PrismaService, AuthService],
})
export class AppModule {
  configure(consumer) {
    //   consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer
      .apply(UserCheckerMiddleware)
      .forRoutes({ path: 'stores/:storeId', method: RequestMethod.GET });
  }
}
