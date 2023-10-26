import { forwardRef } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StoresModule } from 'src/stores/stores.module';
import { LikesController } from './likes.controller';
import { LikesModule } from './likes.module';
import { LikesRepository } from './likes.repository';
import { LikesService } from './likes.service';

describe('LikesModule', () => {
  let likesModule: LikesModule;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [PrismaModule, forwardRef(() => StoresModule), LikesModule],
    }).compile();

    likesModule = module.get<LikesModule>(LikesModule);
  });

  it('should be defined', () => {
    expect(likesModule).toBeDefined();
  });

  it('Controller에 LikesController가 있어야 함.', () => {
    expect(module.get<LikesController>(LikesController)).toBeDefined();
  });

  it('프로바이더로 LikesService가 있어야 함.', () => {
    expect(module.get<LikesService>(LikesService)).toBeDefined();
  });

  it('프로바이더로 LikesRepository 있어야 함.', () => {
    expect(module.get<LikesRepository>(LikesRepository)).toBeDefined();
  });
});
