import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ItemsRepository } from './items.repository';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [ItemsRepository],
  exports: [ItemsRepository],
})
export class ItemsModule {}
