import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserJwt } from '../types/service/auth';

@Injectable()
export class OwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user: UserJwt = req.user;
    const item_userId = req.body.userId;

    return user.sub == item_userId;
  }
}
