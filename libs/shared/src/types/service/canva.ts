/* eslint-disable */
import { GRPC_PACKAGE } from '@app/shared';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const GRPC_CANVA: GRPC_PACKAGE = {
  protoName: 'canva',
  packageName: 'canva',
  serviceName: 'CanvaService',
  host: process.env['CANVA_SERVICE_HOST'],
  port: process.env['CANVA_SERVICE_PORT'],
  httpPort: process.env['CANVA_SERVICE_HTTP_PORT'],
};

interface Empty {}

export interface Canvas {
  canvas: Canva[];
}

export interface Canva {
  id: string;
  name: string;
  userId: string;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
}

export class CanvaGetId {
  id: string;
  userId: string;
}

export class CanvaCreate {
  name: string;
  userId: string;
}

export class CanvaUpdate {
  id: string;
  name: string;
  userId: string;
}

export class CanvaDelete {
  id: string;
  userId: string;
}

export class CanvaGetAll {
  userId: string;
}

export interface ICanvaServiceClient {
  create(data: CanvaCreate): Observable<Promise<Canva>>;

  delete(data: CanvaDelete): Observable<Promise<Empty>>;

  update(data: CanvaUpdate): Observable<Promise<Canva>>;

  get(data: CanvaGetId): Observable<Promise<Canva>>;

  getAll(data: CanvaGetAll): Observable<Promise<Canvas>>;
}

export interface ICanvaServiceController {
  create(data: CanvaCreate): Promise<Canva>;

  delete(data: CanvaDelete): void;

  update(data: CanvaUpdate): Promise<Canva>;

  get(data: CanvaGetId): Promise<Canva>;

  getAll(data: CanvaGetAll): Promise<Canvas>;
}

export function CanvaServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'create',
      'delete',
      'update',
      'get',
      'getAll',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod(GRPC_CANVA.serviceName, method)(
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
      GrpcStreamMethod(GRPC_CANVA.serviceName, method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}
