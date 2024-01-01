import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { GRPC_PACKAGE } from '@app/shared';

export const GRPC_TODO: GRPC_PACKAGE = {
  protoName: 'todo',
  packageName: 'todo',
  serviceName: 'TodoService',
  host: process.env['TODO_SERVICE_HOST'],
  port: process.env['TODO_SERVICE_PORT'],
};

interface Empty {}

export interface Todos {
  todos: Todo[];
}

export interface Todo {
  id: string;
  title: string;
  content: string;
  canvaId: string;
  order: number;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  userId: string;
}

export class TodoGetId {
  id: string;
  userId: string;
}

export class TodoCreate {
  title: string;
  content: string;
  userId: string;
  canvaId: string;
}

export class TodoUpdate {
  id: string;
  title: string;
  content: string;
  userId: string;
  status: boolean;
}

export class TodoDelete {
  id: string;
  userId: string;
}

export class TodoUpdateOrder {
  id: string;
  order: number;
  userId: string;
}

export class TodoGetAll {
  userId: string;
}

export class TodoGetCanvaItems {
  userId: string;
  canvaId: string;
}

export interface ITodoServiceClient {
  create(data: TodoCreate): Observable<Promise<Todo>>;

  delete(data: TodoDelete): Observable<Promise<Empty>>;

  update(data: TodoUpdate): Observable<Promise<Todo>>;

  get(data: TodoGetId): Observable<Promise<Todo>>;

  getAll(data: TodoGetAll): Observable<Promise<Todos>>;

  updateOrder(data: TodoUpdateOrder): Observable<Promise<Todo>>;

  // getAllCanvaItems(data: TodoGetCanvaItems): Observable<Promise<Todos>>;
}

export interface ITodoServiceController {
  create(data: TodoCreate): Promise<Todo>;

  delete(data: TodoDelete): void;

  update(data: TodoUpdate): Promise<Todo>;

  get(data: TodoGetId): Promise<Todo>;

  getAll(data: TodoGetAll): Promise<Todos>;

  updateOrder(data: TodoUpdateOrder): Promise<Todo>;

  // getAllCanvaItems(data: TodoGetCanvaItems): Promise<Todos>;
}

export function TodoServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'create',
      'delete',
      'update',
      'get',
      'getAll',
      'updateOrder',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod(GRPC_TODO.serviceName, method)(
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
      GrpcStreamMethod(GRPC_TODO.serviceName, method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}
