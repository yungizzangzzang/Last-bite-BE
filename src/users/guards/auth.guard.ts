import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthService } from 'src/users/auth/auth.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: Request) {
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const jwtString = authorizationHeader.split('Bearer ')[1];
    if (!jwtString) {
      throw new UnauthorizedException('JWT token is missing');
    }

    // this.authService.verify(jwtString);

    return true;
  }
}
