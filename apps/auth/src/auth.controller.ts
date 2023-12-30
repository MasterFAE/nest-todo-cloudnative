import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RpcException } from '@nestjs/microservices';
import {
  AuthServiceControllerMethods,
  IAuthServiceController,
  LoginDto,
  UserTokenPayload,
  CreateUserDto,
  JwtToken,
  UserJwtPayload,
  UserJwt,
} from '@app/shared/types/service/auth';
import serviceExceptionGenerator from '@app/shared/helper/functions/serviceExceptionGenerator';

@Controller()
@AuthServiceControllerMethods()
export class AuthController implements IAuthServiceController {
  constructor(private readonly authService: AuthService) {}

  async login(data: LoginDto): Promise<UserTokenPayload> {
    try {
      const userWithToken = await this.authService.login(data);
      return userWithToken;
    } catch (er) {
      const { error } = serviceExceptionGenerator(er);
      throw new RpcException(error);
    }
  }

  async register(data: CreateUserDto): Promise<UserTokenPayload> {
    try {
      const userWithToken = await this.authService.register(data);
      return userWithToken;
    } catch (er) {
      const { error } = serviceExceptionGenerator(er);
      throw new RpcException(error);
    }
  }

  async verifyToken(data: JwtToken): Promise<UserJwtPayload> {
    try {
      const res = await this.authService.verifyToken(data);
      return res;
    } catch (er) {
      const { error } = serviceExceptionGenerator(er);
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
