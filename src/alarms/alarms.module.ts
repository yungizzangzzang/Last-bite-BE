import { Module } from '@nestjs/common';
import { AlarmsGateway } from './alarms.gateway';

@Module({
  imports: [], // prisma연결 코드 추가(forFeature)
  providers: [AlarmsGateway],
})
export class AlarmsModule {}
