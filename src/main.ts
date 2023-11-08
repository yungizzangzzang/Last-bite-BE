import { faker } from '@faker-js/faker';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { SuccessInterceptor } from './common/interceptors/success.interceptor';
import { UndefinedToNullInterceptor } from './common/interceptors/undefinedToNull.interceptor';
import { PrismaService } from './prisma/prisma.service';

async function main() {
  const numberOfUsers = 900;
  // const numberOfItems = 1000;
  const prisma = new PrismaService();
  // User 데이터 생성
  const users: any[] = [];
  for (let i = 0; i < numberOfUsers; i++) {
    users.push({
      isClient: false,
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: '종훈',
      point: faker.datatype.number(1000000000),
      nickname: faker.internet.userName(),
    });
  }

  // Users 생성
  await prisma.users.createMany({
    data: users,
    skipDuplicates: true,
  });

  // // Item 데이터 생성
  // const items: any[] = [];
  // for (let i = 0; i < numberOfItems; i++) {
  //   items.push({
  //     name: faker.commerce.productName(),
  //     prevPrice: 12000,
  //     price: 10000,
  //     count: 100000,
  //     startTime: new Date(`2023-01-01T20:00:00.000Z`),
  //     endTime: new Date(`2023-01-01T22:00:00.000Z`),
  //     content: faker.lorem.paragraphs(),
  //     storeId: 1,
  //   });
  // }

  // // Items 생성
  // await prisma.items.createMany({
  //   data: items,
  //   skipDuplicates: true,
  // });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 8000;

  const config = new DocumentBuilder()
    .setTitle('Yungizzang')
    .setDescription('Yungizzang API doc')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'jwt',
    )
    .setVersion('1.0')
    .addTag('Yungizzang')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(
    new UndefinedToNullInterceptor(),
    new SuccessInterceptor(),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors({
    origin: process.env.CLIENT_URL || `http://localhost:3000`,

    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // main();
  app.use(cookieParser());
  await app.listen(PORT);
}
bootstrap();
