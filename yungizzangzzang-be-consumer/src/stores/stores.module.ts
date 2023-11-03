import { Module } from '@nestjs/common';
import { ItemsModule } from 'src/items/items.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StoresRepository } from './stores.repository';

@Module({
  imports: [PrismaModule, ItemsModule],
  controllers: [],
  providers: [StoresRepository],
  exports: [StoresRepository],
})
export class StoresModule {}
