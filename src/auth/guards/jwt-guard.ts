import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

//This class extends de authguard from the passport dependency allowing to use the JwtAuthGuard directly in the endpoints

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
