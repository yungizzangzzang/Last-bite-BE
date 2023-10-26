import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

// e2e테스트: end to end -> 실제로 요청을 날리는 것 (src안에 있는 spec붙은 것들은 unit테스트)
describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/main (GET)', () => {
    return request(app.getHttpServer())
      .get('/main')
      .expect(200)
      .expect('하이루!');
  });

  // *테스트용 db에 접속해서 돌리기(실제 db에 x) - 환경변수에서 db하나 더 파서, 접속할 때 포트번호 바꾸기
  // *테스트한 내용이 실제 db에 쌓이면 안됨(db가 '오염'된다) -> 실제 회원가입은 중복만 작성해둠 일단
  describe('about user', () => {
    // 1. user조회 위해서는 인증이 되어야 한다 -> 안되면 401에러
    it('/user (GET)', async () => {
      const res = await request(app.getHttpServer()).get('/user');
      expect(res.statusCode).toBe(401);
    });

    // 2-1. 회원가입시, email 중복 여부 확인
    it('/signup-isDuplicated (POST)', async () => {
      const res = await request(app.getHttpServer()).post('/signup').send({
        // *아래처럼 직접 입력하기 보다는, mocking데이터 or 페이크 이메일 만들어서
        email: 'alreadySigned@naver.com',
        password: '1234',
        name: 'test',
        isClient: true,
        nickname: '아무거나입력',
      });
      expect(res.statusCode).toBe(500);
    });

    // 2-2. nickname 중복 여부 확인
    it('/signup-isDuplicated (POST)', async () => {
      const res = await request(app.getHttpServer()).post('/signup').send({
        email: '아무거나입력@naver.com',
        password: '1234',
        name: 'test',
        isClient: true,
        nickname: '회원가입중복체크테스트코드용도',
      });
      expect(res.statusCode).toBe(500);
    });

    // 3. 회원가입
    // it('/signup-successCase (POST)', async () => {
    //   const res = await request(app.getHttpServer()).post('/signup').send({
    //     email: '회원가입성공@naver.com',
    //     password: '1234',
    //     name: '성공테스트',
    //     isClient: true,
    //     nickname: '성공테스트',
    //   });
    //   expect(res.statusCode).toBe(201);
    //   expect(res.body).toBe({
    //     email: '~',
    //     name: '~',
    //     // ...
    //   });
    // });

    // 4. 로그인
  });
});
