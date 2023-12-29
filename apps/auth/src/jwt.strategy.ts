import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: JwtStrategy.extractJWTfromCookie,
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  static extractJWTfromCookie(req): string {
    return req.cookies ? req.cookies.access_token : req.token ?? null;
  }

  validate(payload: any) {
    return payload;
  }
}
