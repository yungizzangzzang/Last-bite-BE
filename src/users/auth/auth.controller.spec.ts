import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { authTestingModule } from './auth.test-utils';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  const res: Partial<Response> = {
    cookie: jest.fn(),
  };
  const TEST_EMAIL = 'test@email.com';
  const TEST_PASSWORD = 'password';
  const TEST_NAME = 'name';
  const TEST_NICKNAME = 'nickname';
  const TEST_MANAGEMENT_NUMBER = '1234';
  const TEST_USER_ID = 1;

  const defaultSignUpRequest = {
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    name: TEST_NAME,
    isClient: true,
    nickname: TEST_NICKNAME,
    managementNumber: TEST_MANAGEMENT_NUMBER,
  };

  const loginDto = {
    email: 'test@email.com',
    password: 'password',
  };

  const wrongLoginDto = {
    email: 'wrong@email.com',
    password: 'wrongPassword',
  };

  const loginResponseDto = {
    accessToken: 'accessToken',
    user: {
      userId: expect.any(Number),
      nickname: expect.any(String),
      isClient: expect.any(Boolean),
      email: expect.any(Number),
    },
    message: expect.any(String),
  };

  const userInfoDto = {
    userId: expect.any(Number),
    email: expect.any(String),
    isClient: expect.any(Boolean),
    nickname: expect.any(String),
    name: expect.any(String),
    point: expect.any(Number),
  };

  beforeEach(async () => {
    const { moduleBuilder } = await authTestingModule();
    const module: TestingModule = await moduleBuilder.compile();
    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  jest.clearAllMocks();

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('회원가입', async () => {
      jest
        .spyOn(controller, 'signUp')
        .mockResolvedValue({ message: expect.any(String) });

      const result = await controller.signUp(defaultSignUpRequest);

      expect(result).toEqual({ message: expect.any(String) });
    });

    it('중복된 이메일 또는 닉네임으로 인한 회원가입 실패', async () => {
      jest
        .spyOn(controller, 'signUp')
        .mockRejectedValue(
          new ConflictException('이미 존재하는 이메일 or 닉네임 입니다'),
        );

      await expect(controller.signUp(defaultSignUpRequest)).rejects.toThrow(
        ConflictException,
      );
    });

    it('isClient가 false이면서 managementNumber를 입력하지 않으면 회원가입 실패', async () => {
      jest.spyOn(controller, 'signUp').mockRejectedValue(
        new BadRequestException({
          message: '관리자 번호를 입력해주세요',
        }),
      );

      const user = {
        ...defaultSignUpRequest,
        isClient: false,
        managementNumber: null,
      };

      await expect(controller.signUp(user)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    it('로그인', async () => {
      jest.spyOn(authService, 'login').mockResolvedValue(loginResponseDto);

      const result = await controller.login(loginDto, res as Response);
      expect(res.cookie).toHaveBeenCalledWith(
        'Authorization',
        'accessToken',
        expect.any(Object),
      );
      expect(result).toEqual(loginResponseDto);
    });

    it('이메일을 입력했지만 DB에서 조회되지 않을경우 에러를 반환.', async () => {
      jest.spyOn(authService, 'login').mockRejectedValue(
        new ForbiddenException({
          message: '이메일과 비밀번호를 확인해주세요',
        }),
      );

      await expect(
        controller.login(wrongLoginDto, res as Response),
      ).rejects.toThrowError('이메일과 비밀번호를 확인해주세요');
    });

    it('비밀번호를 잘못 입력했을 때 이메일과 비밀번호를 확인해주세요 라는 에러를 반환.', async () => {
      jest.spyOn(authService, 'login').mockRejectedValue(
        new ForbiddenException({
          message: '이메일과 비밀번호를 확인해주세요',
        }),
      );
      await expect(
        controller.login(wrongLoginDto, res as Response),
      ).rejects.toThrowError('이메일과 비밀번호를 확인해주세요');
    });
  });

  describe('pointAccumulation', () => {
    const gettingPointsDto = { point: 100 };
    const mockUser = {
      userId: TEST_USER_ID,
      point: 0,
    };

    it('포인트 충전 성공', async () => {
      jest
        .spyOn(authService, 'pointAccumulation')
        .mockResolvedValue({ message: '포인트 충전에 성공하였습니다.' });

      const result = await controller.pointAccumulation(
        gettingPointsDto,
        mockUser,
      );

      expect(result).toEqual({ message: '포인트 충전에 성공하였습니다.' });
    });
  });

  describe('logout', () => {
    it('로그아웃', async () => {
      const response: Partial<Response> = {
        clearCookie: jest.fn(),
      };
      await controller.logOut(response as Response);
      expect(response.clearCookie).toHaveBeenCalledWith('jwt');
    });
  });

  describe('whoAmI', () => {
    it('회원 정보 조회 성공', async () => {
      jest.spyOn(authService, 'findOneUser').mockResolvedValue(userInfoDto);

      const result = await controller.whoAmI({ userId: TEST_USER_ID });
      expect(result).toEqual(userInfoDto);
    });

    it('회원 정보 조회 실패', async () => {
      jest
        .spyOn(authService, 'findOneUser')
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(
        controller.whoAmI({ userId: TEST_USER_ID }),
      ).rejects.toThrowError('User not found');
    });
  });
});
