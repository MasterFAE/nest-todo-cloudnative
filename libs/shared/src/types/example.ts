/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Empty } from './auth';

export const GRPC_EXAMPLE = {
  protoName: 'example',
  packageName: 'example',
  serviceName: 'ExampleService',
};

export interface Example {
  id: number;
  name: string;
  published: boolean;
}

export interface Examples {
  examples: Example[];
}

export interface CreateExampleDto {
  id: number;
  name: string;
}

export interface GetExampleById {
  id: number;
}

export interface UpdateExampleDto {
  id: number;
  name: string;
  published: boolean;
}

export interface DeleteExampleDto {
  id: number;
}

export interface IExampleServiceClient {
  create(request: CreateExampleDto): Observable<Example>;

  get(request: GetExampleById): Observable<Example>;

  getAll(request: Empty): Observable<Examples>;

  update(request: UpdateExampleDto): Observable<Example>;

  delete(request: DeleteExampleDto): Observable<Empty>;
}

export interface IExampleServiceController {
  create(
    request: CreateExampleDto,
  ): Promise<Example> | Observable<Example> | Example;

  get(
    request: GetExampleById,
  ): Promise<Example> | Observable<Example> | Example;

  getAll(request: Empty): Promise<Examples> | Observable<Examples> | Examples;

  update(
    request: UpdateExampleDto,
  ): Promise<Example> | Observable<Example> | Example;

  delete(request: DeleteExampleDto): Promise<Empty> | Observable<Empty> | Empty;
}

export function ExampleServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'create',
      'get',
      'getAll',
      'update',
      'delete',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('ExampleService', method)(
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
      GrpcStreamMethod('ExampleService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}
