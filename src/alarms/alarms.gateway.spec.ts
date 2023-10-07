import { Test, TestingModule } from '@nestjs/testing';
import { AlarmsGateway } from './alarms.gateway';

describe('AlarmsGateway', () => {
  let gateway: AlarmsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlarmsGateway],
    }).compile();

    gateway = module.get<AlarmsGateway>(AlarmsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
