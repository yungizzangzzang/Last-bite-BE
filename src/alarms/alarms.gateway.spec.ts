import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from 'src/prisma/prisma.service';
import { AlarmsGateway } from './alarms.gateway';
import { AlarmsRepository } from './alarms.repository';

describe('AlarmsGateway', () => {
  let gateway: AlarmsGateway;
  let repository: AlarmsRepository;
  let mockPrisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlarmsGateway, AlarmsRepository, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    gateway = module.get<AlarmsGateway>(AlarmsGateway);
    repository = module.get<AlarmsRepository>(AlarmsRepository);
    // mockPrisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(gateway).toBeDefined();
  });
});
