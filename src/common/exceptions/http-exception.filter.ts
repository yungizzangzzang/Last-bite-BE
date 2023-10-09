import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const err = exception.getResponse() as
      | { message: any; statusCode: number }
      | { error: string; statusCode: 400; message: string[] };

    const message = err.message;
    if (typeof err !== 'string' && err.statusCode === 400) {
      return response.status(status).json({
        success: false,
        code: status,
        data: { ...err, message: message },
      });
    }

    response.status(status).json({
      success: false,
      code: status,
      data: { ...err, message: message },
    });
  }
}
