import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromReqeust: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('auth.jwtSecret'),
    });
  }

  async validate(payload: { email: string }) {
    const user = await this.usersService.findOneUser(payload.email);
    if (!user) {
      throw new UnauthorizedException('invalid token');
    }
    return user;
  }
}
