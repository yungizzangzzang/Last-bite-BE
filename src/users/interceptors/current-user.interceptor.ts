import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { AuthService } from 'src/users/auth/auth.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private authSerivce: AuthService) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const reqeust = context.switchToHttp().getRequest();
    const { userId } = reqeust.session || {};

    if (userId) {
      const user = await this.authSerivce.findOneUser(userId);
      reqeust.currentUser = user;
    }

    return handler.handle();
  }
}
