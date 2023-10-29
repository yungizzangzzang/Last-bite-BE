import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express/multer';
import { memoryStorage } from 'multer';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AwsService } from './aws.service';
import { ItemsController } from './items.controller';
import { ItemsRepository } from './items.repository';
import { ItemsService } from './items.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './upload',
      storage: memoryStorage(),
    }),
    PrismaModule,
  ],
  controllers: [ItemsController],
  providers: [ItemsService, ItemsRepository, AwsService],
  exports: [ItemsRepository],
})
export class ItemsModule {}
