import { Injectable } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from '@app/prisma';
import * as bcrypt from 'bcryptjs';
import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  JwtToken,
  UserSignJwt,
  UserJwtPayload,
  UserTokenPayload,
  UserId,
  UserCreate,
  UserLogin,
} from '@app/shared/types/service/auth';
import { User } from '@prisma/client';
import { ServiceException } from '@app/shared/exceptions/custom-service.exception';

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
  }: UserCreate): Promise<UserTokenPayload> {
    const checkUser = await this.checkUser(email, username);
    if (checkUser && checkUser.id)
      throw new ServiceException(Status.ALREADY_EXISTS, 'User already exists');
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

  async login({ email, password }: UserLogin): Promise<UserTokenPayload> {
    const checkUser = await this.checkUser(email);
    if (!checkUser)
      throw new ServiceException(
        Status.INVALID_ARGUMENT,
        'Invalid email or password',
      );

    const compare = await bcrypt.compare(password, checkUser.password);
    if (!compare)
      throw new ServiceException(
        Status.INVALID_ARGUMENT,
        'Invalid email or password',
      );

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

  async getUserFromId(data: UserId): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: data.id,
      },
    });
    let { password, ..._user } = user;
    return _user;
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
        throw new ServiceException(
          Status.RESOURCE_EXHAUSTED,
          error.expiredAt.toString(),
        );
      throw new ServiceException(Status.UNAUTHENTICATED);
    }
  }

  async signToken(user: UserSignJwt): Promise<JwtToken> {
    const token = this.jwtService.sign({ user });
    return { token };
  }

  async decodeToken({ token }: JwtToken): Promise<UserJwtPayload> {
    if (!token) {
      throw new ServiceException(Status.INVALID_ARGUMENT);
    }
    try {
      const { user, exp } = await this.jwtService.decode(token);
      return { user, exp };
    } catch (error) {
      throw new ServiceException(Status.UNAUTHENTICATED);
    }
  }
}
