import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from 'src/users/auth/auth.service';

@Injectable()
export class UserCheckerMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  async use(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    const authorization = request.headers['authorization'];
    if (authorization) {
      try {
        const token = authorization.split(' ')[1];
        const user = this.jwtService.verify(token, {
          secret: process.env.ACCESS_SECRET_KEY,
        });

        request.user = user.user;
      } catch (error: any) {}
    }

    next();
  }
}
