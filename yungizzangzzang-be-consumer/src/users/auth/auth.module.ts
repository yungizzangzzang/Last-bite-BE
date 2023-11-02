import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from 'src/users/auth/auth.service';

@Module({
  imports: [PrismaModule],
  providers: [AuthService],
  controllers: [],
  exports: [AuthService],
})
export class AuthModule {}
