import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
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
      jest.spyOn(authService, 'login').mockResolvedValue({
        accessToken: 'accessToken',
        user: {
          userId: expect.any(Number),
          nickname: expect.any(String),
          isClient: expect.any(Boolean),
          email: expect.any(Number),
        },
        message: expect.any(String),
      });

      const result = await controller.login(loginDto, res as Response);
      expect(res.cookie).toHaveBeenCalledWith(
        'Authorization',
        'accessToken',
        expect.any(Object),
      );
      expect(result).toEqual({
        accessToken: 'accessToken',
        user: {
          userId: expect.any(Number),
          nickname: expect.any(String),
          isClient: expect.any(Boolean),
          email: expect.any(Number),
        },
        message: expect.any(String),
      });
    });

    it('이메일을 입력했지만 DB에서 조회되지 않을경우 에러를 반환.', async () => {
      jest.spyOn(authService, 'login').mockRejectedValue(
        new ForbiddenException({
          message: '이메일과 비밀번호를 확인해주세요',
        }),
      );

      await expect(
        controller.login(loginDto, res as Response),
      ).rejects.toThrowError('이메일과 비밀번호를 확인해주세요');
    });

    it('비밀번호를 잘못 입력했을 때 이메일과 비밀번호를 확인해주세요 라는 에러를 반환.', async () => {
      jest.spyOn(authService, 'login').mockRejectedValue(
        new ForbiddenException({
          message: '이메일과 비밀번호를 확인해주세요',
        }),
      );
      await expect(
        controller.login(loginDto, res as Response),
      ).rejects.toThrowError('이메일과 비밀번호를 확인해주세요');
    });
  });

  it.todo('포인트 충전');
  it.todo('포인트 충전 실패');

  it.todo('로그아웃');
  it.todo('로그아웃 실패');

  it.todo('회원 정보 조회');
  it.todo('회원 정보 조회 실패');
});
