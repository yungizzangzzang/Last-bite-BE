// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { Request } from 'express';
// import { jwtConstants } from '../auth/constants';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(private jwtService: JwtService) {}
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const token = this.extractTokenFromHeader(request);
//     if (!token) {
//       throw new UnauthorizedException();
//     }
//     try {
//       const payload = await this.jwtService.verifyAsync(token, {
//         secret: jwtConstants.secret,
//       });
//       request['user'] = payload;
//     } catch {
//       throw new UnauthorizedException();
//     }
//     return true;
//   }

//   // private validateRequest(request: Request) {
//   //   const authorizationHeader = request.headers.authorization;
//   //   if (!authorizationHeader) {
//   //     throw new UnauthorizedException('Authorization header is missing');
//   //   }

//   //   const jwtString = authorizationHeader.split('Bearer ')[1];
//   //   if (!jwtString) {
//   //     throw new UnauthorizedException('JWT token is missing');
//   //   }

//   //   return true;
//   // }

//   private extractTokenFromHeader(request: Request): string | undefined {
//     const [type, token] = request.headers.authorization?.split(' ') ?? [];
//     return type === 'Bearer' ? token : undefined;
//   }
// }
