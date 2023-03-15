import { UserModel } from './../user.model';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExparation: true,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async valideate({ email }: Pick<UserModel, 'email'>) {
    return email;
  }
}
