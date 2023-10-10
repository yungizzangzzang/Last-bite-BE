import { Module } from '@nestjs/common';
import { AlarmsGateway } from './alarms.gateway';
import { AlarmsRepository } from './alarms.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AlarmsGateway, AlarmsRepository],
  exports: [AlarmsGateway],
})
export class AlarmsModule {}
