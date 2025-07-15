import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

//Creating the and configuring the local strategy
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  //this function will get the validateUser function and run it when the user attemps to login
  validate(email: string, password: string) {
    return this.authService.validateUser(email, password);
  }
}
