import {
  Controller,
  Post,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-guard/local-guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //Endpoint to login and validate the use info and create the token
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    //Calling the login function that creates and return a token for the user to use in the app
    const token = await this.authService.login(req.user.id);
    return { id: req.user.id, token };
  }
}
