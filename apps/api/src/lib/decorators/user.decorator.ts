import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import JwtUser from '../jwt-user';

export const User = createParamDecorator(
  (data: keyof JwtUser, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: JwtUser = request.user;

    return data ? user?.[data] : user;
  },
);
