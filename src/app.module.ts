import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlarmsGateway } from './alarms/alarms.gateway';
import { AlarmsModule } from './alarms/alarms.module';

@Module({
  imports: [AlarmsModule],
  controllers: [AppController],
  providers: [AppService, AlarmsGateway],
})
export class AppModule {}
