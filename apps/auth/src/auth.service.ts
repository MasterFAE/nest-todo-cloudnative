import { Injectable } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from '@app/prisma';
import * as bcrypt from 'bcryptjs';

import { CustomRpcException } from '@app/shared/exceptions/custom-rpc.exception';
import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  CreateUserDto,
  JwtToken,
  LoginDto,
  User,
  UserJwt,
  UserJwtPayload,
  UserTokenPayload,
} from '@app/shared/types/service/auth';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async register({
    username,
    email,
    password,
  }: CreateUserDto): Promise<UserTokenPayload> {
    const checkUser = await this.checkUser(email, username);
    if (checkUser && checkUser.id)
      throw new CustomRpcException(Status.ALREADY_EXISTS);
    const hash = bcrypt.hashSync(password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hash,
      },
    });
    const { token } = await this.signToken({
      username,
      email,
      sub: newUser.id,
    });

    // Instead of delete user.password using this
    const { password: _, ...noPasswordUser } = newUser;

    return { user: noPasswordUser, token };
  }

  async login({ email, password }: LoginDto): Promise<UserTokenPayload> {
    const checkUser = await this.checkUser(email);
    if (!checkUser) throw new CustomRpcException(Status.INVALID_ARGUMENT);

    const compare = await bcrypt.compare(password, checkUser.password);
    if (!compare) throw new CustomRpcException(Status.INVALID_ARGUMENT);

    // Instead of delete user.password using this
    const { password: _, ...noPasswordUser } = checkUser;

    const { token } = await this.signToken({
      username: noPasswordUser.username,
      email,
      sub: noPasswordUser.id,
    });

    return { user: noPasswordUser, token };
  }

  async checkUser(email, username?): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, username != null ? { username } : {}],
      },
    });
    return user;
  }

  async verifyToken({ token }: JwtToken): Promise<UserJwtPayload> {
    if (!token) {
      throw new RpcException('JWT token is missing');
    }

    try {
      const { user, exp } = await this.jwtService.verifyAsync(token);
      return { user, exp };
    } catch (error) {
      if (error instanceof TokenExpiredError)
        throw new CustomRpcException(
          Status.RESOURCE_EXHAUSTED,
          error.expiredAt.toString(),
        );
      throw new CustomRpcException(Status.UNAUTHENTICATED);
    }
  }

  async signToken(user: UserJwt): Promise<JwtToken> {
    const token = this.jwtService.sign({ user });
    return { token };
  }

  async decodeToken({ token }: JwtToken): Promise<UserJwtPayload> {
    if (!token) {
      throw new CustomRpcException(Status.INVALID_ARGUMENT);
    }

    try {
      const { user, exp } = await this.jwtService.decode(token);
      return { user, exp };
    } catch (error) {
      throw new CustomRpcException();
    }
  }
}
