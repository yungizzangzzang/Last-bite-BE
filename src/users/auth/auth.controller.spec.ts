import { TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { authTestingModule } from './auth.test-utils';

describe('AuthController', () => {
  let controller: AuthController;
  let mocks: any;

  beforeEach(async () => {
    const { moduleBuilder, mocks: mockObjects } = await authTestingModule();
    const module: TestingModule = await moduleBuilder.compile();
    controller = module.get<AuthController>(AuthController);
    mocks = mockObjects;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(mockPrisma).toBeDefined();
  });
});
