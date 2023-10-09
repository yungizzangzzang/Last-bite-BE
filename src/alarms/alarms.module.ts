import { Module } from '@nestjs/common';
import { AlarmsGateway } from './alarms.gateway';

@Module({
  imports: [], // alarms.repo를 쓰게 된다면 -> prisma연결 코드 추가(forFeature)
  providers: [AlarmsGateway],
  exports: [AlarmsGateway],
})
export class AlarmsModule {}
