import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import setCookieOptions from '@app/shared/helper/functions/setCookieOptions';
import { IAuthServiceClient, GRPC_AUTH, UserJwt } from '../types/service/auth';

@Injectable()
export class AuthGuard implements CanActivate {
  private authService: IAuthServiceClient;

  constructor(
    @Inject(GRPC_AUTH.serviceName) private readonly client: ClientGrpc,
    private readonly reflector: Reflector,
  ) {}

  onModuleInit() {
    this.authService = this.client.getService<IAuthServiceClient>(
      GRPC_AUTH.serviceName,
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() !== 'http') {
      return false;
    }
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();
    const access_token = req.cookies.access_token ?? '';

    try {
      const data = await firstValueFrom(
        this.authService.verifyToken({
          token: access_token,
        }),
      );
      // The user called back from jwt.strategy is now accesible with req.user
      req.user = data.user;
      return true;
    } catch (error) {
      if (error.code != 8) throw new UnauthorizedException();

      const expiredAt = error.details;
      const { user } = await firstValueFrom(
        this.authService.decodeToken({
          token: access_token,
        }),
      );

      if (!this.dateCheck(expiredAt))
        throw new UnauthorizedException('Session expired');

      await this.refreshToken(context, user);
      req.user = user;
      return true;
    }
  }

  /**
   * Refresh access_token and save it in the cookies
   * @param context
   * @param user
   */
  async refreshToken(context: ExecutionContext, user: UserJwt) {
    console.log('Refresh Token Middleware Triggered');
    const { token: newToken } = await firstValueFrom(
      this.authService.signToken(user),
    );
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    req.cookies.access_token = newToken;
    setCookieOptions(res, 'access_token', newToken);
  }

  dateCheck(exp: number | Date) {
    // Get date of one day earlier
    const $aDayEarlier = Date.now() - 1000 * 60 * 60 * 24;
    // Check if token expire date is between 1 days from now
    return new Date(exp).getTime() >= $aDayEarlier;
  }
}
