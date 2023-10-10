import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { SuccessInterceptor } from './common/interceptors/success.interceptor';
import { UndefinedToNullInterceptor } from './common/interceptors/undefinedToNull.interceptor';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 8000;

  const config = new DocumentBuilder()
    .setTitle('Yungizzang')
    .setDescription('Yungizzang API doc')
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

  app.use(cookieParser());

  await app.listen(PORT);
}
bootstrap();
