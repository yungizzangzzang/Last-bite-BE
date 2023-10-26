import { TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { authTestingModule } from './auth.test-utils';

describe('AuthService', () => {
  let service: AuthService;
  let mocks: any;

  beforeEach(async () => {
    const { moduleBuilder, mocks: mockObjects } = await authTestingModule();
    const module: TestingModule = await moduleBuilder.compile();
    service = module.get<AuthService>(AuthService);
    mocks = mockObjects;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
