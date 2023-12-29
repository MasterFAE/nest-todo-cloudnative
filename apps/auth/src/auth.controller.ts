import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RpcException } from '@nestjs/microservices';
import {
  AuthServiceControllerMethods,
  CreateUserDto,
  IAuthServiceController,
  JwtToken,
  LoginDto,
  UserJwt,
  UserJwtPayload,
  UserTokenPayload,
} from '@app/shared';

@Controller()
@AuthServiceControllerMethods()
export class AuthController implements IAuthServiceController {
  constructor(private readonly authService: AuthService) {}

  async login(data: LoginDto): Promise<UserTokenPayload> {
    try {
      const userWithToken = await this.authService.login(data);
      return userWithToken;
    } catch ({ error }) {
      throw new RpcException(error);
    }
  }

  async register(data: CreateUserDto): Promise<UserTokenPayload> {
    try {
      const userWithToken = await this.authService.register(data);
      return userWithToken;
    } catch ({ error }) {
      throw new RpcException(error);
    }
  }

  // @UseGuards(JwtGuard)
  async verifyToken(data: JwtToken): Promise<UserJwtPayload> {
    try {
      const res = await this.authService.verifyToken(data);
      return res;
    } catch ({ error }) {
      throw new RpcException(error);
    }
  }

  async decodeToken(data: JwtToken): Promise<UserJwtPayload> {
    return this.authService.decodeToken(data);
  }

  async signToken(data: UserJwt): Promise<JwtToken> {
    return this.authService.signToken(data);
  }
}
