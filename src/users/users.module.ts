import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule],
  providers: [UsersService],
})
export class UsersModule {}
