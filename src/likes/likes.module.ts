import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StoresModule } from 'src/stores/stores.module';
import { LikesController } from './likes.controller';
import { LikesRepository } from './likes.repository';
import { LikesService } from './likes.service';

@Module({
  imports: [PrismaModule, StoresModule],
  controllers: [LikesController],
  providers: [LikesService, LikesRepository],
})
export class LikesModule {}
