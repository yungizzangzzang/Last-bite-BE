import { Module, forwardRef } from '@nestjs/common';
import { ItemsModule } from 'src/items/items.module';
import { LikesModule } from 'src/likes/likes.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StoresController } from './stores.controller';
import { StoresRepository } from './stores.repository';
import { StoresService } from './stores.service';

@Module({
  imports: [PrismaModule, ItemsModule, forwardRef(() => LikesModule)],
  controllers: [StoresController],
  providers: [StoresService, StoresRepository],
  exports: [StoresRepository],
})
export class StoresModule {}
