import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export const GRPC_AUTH = {
  protoName: 'auth',
  packageName: 'auth',
  serviceName: 'AuthService',
};

export interface Empty {}

export interface JwtToken {
  token: string;
}

export class CreateUserDto {
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}

/** Returns User information stored inside JWT */
export interface UserJwt {
  sub: number;
  username: string;
  email: string;
}

/** Returns User information to generate JWT */
export interface UserOfJwt {
  id: number;
  username: string;
  email: string;
}

/** Returns User and expiring date of the token */
export interface UserJwtPayload {
  user: UserJwt | undefined;
  exp: number;
}

/** Returns User and generated JWT token */
export interface UserTokenPayload {
  user: UserOfJwt | undefined;
  token: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

export interface IAuthServiceClient {
  login(request: LoginDto): Observable<Promise<UserTokenPayload>>;

  register(request: CreateUserDto): Observable<Promise<UserTokenPayload>>;

  verifyToken(request: JwtToken): Observable<Promise<UserJwtPayload>>;

  decodeToken(request: JwtToken): Observable<Promise<UserJwtPayload>>;

  signToken(request: UserJwt): Observable<Promise<JwtToken>>;
}

export interface IAuthServiceController {
  login(
    request: LoginDto,
  ):
    | Promise<UserTokenPayload>
    | Observable<UserTokenPayload>
    | UserTokenPayload;

  register(
    request: CreateUserDto,
  ):
    | Promise<UserTokenPayload>
    | Observable<UserTokenPayload>
    | UserTokenPayload;

  verifyToken(
    request: JwtToken,
  ):
    | Promise<UserJwtPayload>
    | Observable<Promise<UserJwtPayload>>
    | UserJwtPayload;

  decodeToken(
    request: JwtToken,
  ): Promise<UserJwtPayload> | Observable<UserJwtPayload> | UserJwtPayload;

  signToken(
    request: UserJwt,
  ): Promise<JwtToken> | Observable<JwtToken> | JwtToken;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'login',
      'register',
      'verifyToken',
      'decodeToken',
      'signToken',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod(GRPC_AUTH.serviceName, method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod(GRPC_AUTH.serviceName, method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}
