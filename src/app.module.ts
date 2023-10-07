import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoresModule } from './stores/stores.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [StoresModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
