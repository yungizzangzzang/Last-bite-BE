import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ItemsController } from './items.controller';
import { ItemsRepository } from './items.repository';
import { ItemsService } from './items.service';

@Module({
  imports: [PrismaModule],
  controllers: [ItemsController],
  providers: [ItemsService, ItemsRepository],
  exports: [ItemsRepository],
})
export class ItemsModule {}
