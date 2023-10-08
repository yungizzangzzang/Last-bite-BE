import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext) {
    console.log('JwtAuthGuard: canActivate 실행');
    const result = (await super.canActivate(context)) as boolean;
    console.log(`AuthGuard 결과: ${result}`);
    return result;
  }
}
