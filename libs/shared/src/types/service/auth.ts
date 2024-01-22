import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { GRPC_PACKAGE } from '@app/shared';

export const GRPC_AUTH: GRPC_PACKAGE = {
  protoName: 'auth',
  packageName: 'auth',
  serviceName: 'AuthService',
  host: process.env['AUTH_SERVICE_HOST'],
  port: process.env['AUTH_SERVICE_PORT'],
  httpPort: process.env['AUTH_SERVICE_HTTP_PORT'],
};

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  lastOnline: Date;
}

export interface JwtToken {
  token: string;
}

export interface UserId {
  id: string;
}

/** Returns User information stored inside JWT */
export interface UserSignJwt {
  sub: string;
  username: string;
  email: string;
}

/** Returns User and expiring date of the token */
export interface UserJwtPayload {
  user: UserSignJwt | undefined;
  exp: number;
}

/** Returns User and generated JWT token */
export interface UserTokenPayload {
  user: UserResponse | undefined;
  token: string;
}

export interface UserCreate {
  username: string;
  password: string;
  email: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface IAuthServiceClient {
  login(data: UserLogin): Observable<Promise<UserTokenPayload>>;

  register(data: UserCreate): Observable<Promise<UserTokenPayload>>;

  verifyToken(data: JwtToken): Observable<Promise<UserJwtPayload>>;

  decodeToken(data: JwtToken): Observable<Promise<UserJwtPayload>>;

  signToken(data: UserSignJwt): Observable<Promise<JwtToken>>;

  currentUser(data: UserId): Observable<Promise<UserResponse>>;
}

export interface IAuthServiceController {
  login(data: UserLogin): Promise<UserTokenPayload>;

  register(data: UserCreate): Promise<UserTokenPayload>;

  verifyToken(
    data: JwtToken,
  ):
    | Promise<UserJwtPayload>
    | Observable<Promise<UserJwtPayload>>
    | UserJwtPayload;

  decodeToken(
    data: JwtToken,
  ): Promise<UserJwtPayload> | Observable<UserJwtPayload> | UserJwtPayload;

  signToken(
    data: UserSignJwt,
  ): Promise<JwtToken> | Observable<JwtToken> | JwtToken;

  currentUser(data: UserId): Promise<UserResponse>;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'login',
      'register',
      'verifyToken',
      'decodeToken',
      'signToken',
      'currentUser',
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
