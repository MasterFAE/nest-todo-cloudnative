import { Controller, UseGuards } from '@nestjs/common';
import { TodoService } from './todo.service';
import { RpcException } from '@nestjs/microservices';
import {
  TodoServiceControllerMethods,
  ITodoServiceController,
  TodoCreate,
  TodoDelete,
  TodoUpdate,
  TodoGetId,
  TodoGetAll,
  Todos,
  TodoUpdateOrder,
} from '@app/shared/types/service/todo';
import { Todo } from '@prisma/client';
import serviceExceptionGenerator from '@app/shared/helper/functions/serviceExceptionGenerator';

@Controller()
@TodoServiceControllerMethods()
export class TodoController implements ITodoServiceController {
  constructor(private readonly todoService: TodoService) {}

  async create(data: TodoCreate): Promise<Todo> {
    try {
      const todo = await this.todoService.create(data);
      return todo;
    } catch (er) {
      const { error } = serviceExceptionGenerator(er);
      throw new RpcException(error);
    }
  }

  async delete(data: TodoDelete): Promise<void> {
    try {
      await this.todoService.delete(data);
    } catch (er) {
      const { error } = serviceExceptionGenerator(er);
      throw new RpcException(error);
    }
  }

  async update(data: TodoUpdate): Promise<Todo> {
    try {
      const todo = await this.todoService.update(data);
      return todo;
    } catch (er) {
      const { error } = serviceExceptionGenerator(er);
      throw new RpcException(error);
    }
  }

  async get(data: TodoGetId): Promise<Todo> {
    try {
      const todo = await this.todoService.get(data);
      return todo;
    } catch (er) {
      const { error } = serviceExceptionGenerator(er);
      throw new RpcException(error);
    }
  }

  async getAll(data: TodoGetAll): Promise<Todos> {
    try {
      const todos = await this.todoService.getAll(data);
      return { todos };
    } catch (er) {
      const { error } = serviceExceptionGenerator(er);
      throw new RpcException(error);
    }
  }

  async updateOrder(data: TodoUpdateOrder): Promise<Todo> {
    try {
      const todo = await this.todoService.updateOrder(data);
      return todo;
    } catch (er) {
      const { error } = serviceExceptionGenerator(er);
      throw new RpcException(error);
    }
  }
}
