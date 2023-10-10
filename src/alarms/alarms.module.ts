import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AlarmsGateway } from './alarms.gateway';
import { AlarmsRepository } from './alarms.repository';

@Module({
  imports: [PrismaModule],
  providers: [AlarmsGateway, AlarmsRepository],
  exports: [AlarmsGateway],
})
export class AlarmsModule {}
