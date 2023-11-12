import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, timeout } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(1500),
      catchError((err) => {
        if (err.name === 'TimeoutError') {
          return throwError(
            new RequestTimeoutException(
              '서버가 요청을 처리하는 데 시간이 너무 오래 걸립니다.',
            ),
          );
        }
        return throwError(err);
      }),
    );
  }
}
