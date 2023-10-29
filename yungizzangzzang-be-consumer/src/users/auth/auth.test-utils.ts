import { JwtService } from '@nestjs/jwt';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

export const authTestingModule = async (): Promise<{
  moduleBuilder: TestingModuleBuilder;
  mocks: any;
}> => {
  let mocks;
  return {
    moduleBuilder: Test.createTestingModule({
      providers: [AuthController, AuthService, JwtService, PrismaService],
    }),
    mocks,
  };
};
