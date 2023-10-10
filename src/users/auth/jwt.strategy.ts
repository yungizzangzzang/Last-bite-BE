import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromReqeust: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_SECRET_KEY,
    });
  }

  async validate(payload: { email: string }) {
    const user = await this.authService.findOneUser(payload.email);
    if (!user) {
      throw new UnauthorizedException('invalid token');
    }
    return user;
  }
}
