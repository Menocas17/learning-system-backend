import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';

dotenv.config();

// Creating the jwt strategy

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  //config for the jwt passport strategy
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  //validate function that will return the data (appending it to the request of the header)

  async validate(payload: any) {
    return { userId: payload.sub, role: payload.role };
  }
}
