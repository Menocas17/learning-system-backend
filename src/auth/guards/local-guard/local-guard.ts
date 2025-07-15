import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

//This class extends de authguard from the passport dependency allowing to use the LocalAuthGuard directly in the endpoints
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
