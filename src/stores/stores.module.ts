import { Module } from '@nestjs/common';
import { ItemsModule } from 'src/items/items.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StoresController } from './stores.controller';
import { StoresRepository } from './stores.repository';
import { StoresService } from './stores.service';

@Module({
  imports: [PrismaModule, ItemsModule],
  controllers: [StoresController],
  providers: [StoresService, StoresRepository],
  exports: [StoresRepository],
})
export class StoresModule {}
