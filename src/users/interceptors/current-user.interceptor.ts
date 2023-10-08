import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersSerivce: UsersService) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const reqeust = context.switchToHttp().getRequest();
    const { userId } = reqeust.session || {};

    if (userId) {
      const user = await this.usersSerivce.findOneUser(userId);
      reqeust.currentUser = user;
    }

    return handler.handle();
  }
}
