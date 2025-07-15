import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcrypt';
import { PassThrough } from 'stream';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userServices: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  //Validating the user info, this function will be used with the auth logic in order to give the user a access token
  async validateUser(email: string, password: string) {
    const user = await this.userServices.getUserByEmail(email);

    const passwordMatch = await compare(password, user.password_hash);

    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    return { id: user.id };
  }

  // this fuctions creates a token wiht the id and role of the user
  async login(userId: string) {
    const userInfo = await this.userServices.findById(userId); // calling the find by id function to get the user role

    const payload = { sub: userId, role: userInfo.role };
    return this.jwtService.sign(payload);
  }
}
