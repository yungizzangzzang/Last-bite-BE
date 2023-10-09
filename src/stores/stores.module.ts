import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StoresRepository } from './stores.repository';

@Module({
  imports: [PrismaModule],
  controllers: [StoresController],
  providers: [StoresService, StoresRepository],
})
export class StoresModule {}
