import { PrismaService } from '@app/prisma';

import { CustomRpcException } from '@app/shared/exceptions/custom-rpc.exception';
import {
  TodoCreate,
  TodoDelete,
  TodoUpdate,
  TodoGetId,
  TodoGetAll,
  TodoUpdateOrder,
} from '@app/shared/types/service/todo';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { Injectable } from '@nestjs/common';
import { Todo } from '@prisma/client';

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: TodoCreate): Promise<Todo> {
    const { userId, canvaId, ...todoData } = data;
    let lastTodo = await this.getLastTodo({ canvaId, userId });

    const todo = await this.prisma.todo.create({
      data: {
        ...todoData,
        user: { connect: { id: userId } },
        canva: { connect: { id: canvaId, userId } },
        order: lastTodo ? lastTodo.order + 1 : 0,
      },
    });

    return todo;
  }

  async getLastTodo({ canvaId, userId }): Promise<Todo | null> {
    const lastTodo = await this.prisma.todo.findFirst({
      where: { canvaId, userId },
      orderBy: { order: 'desc' },
      take: 1,
    });
    return lastTodo;
  }

  async getTodoFromOrder({ canvaId, order }): Promise<Todo> {
    const todo = await this.prisma.todo.findFirst({
      where: { canvaId, order },
    });

    return todo;
  }

  async delete(data: TodoDelete): Promise<void> {
    const { id, userId } = data;
    const todo = await this.get({ id, userId });

    await this.prisma.todo.delete({ where: { id: todo.id } });
  }

  async update(data: TodoUpdate): Promise<Todo> {
    const { id, userId, title, content, status } = data;
    const { canvaId } = await this.get({ id, userId });

    const todo = await this.prisma.todo.update({
      where: { id, userId, canvaId },
      data: { title, content, status },
    });

    return todo;
  }

  async get(data: TodoGetId): Promise<Todo> {
    const todo = await this.prisma.todo.findFirst({ where: data });
    if (!todo)
      throw new CustomRpcException(
        Status.PERMISSION_DENIED,
        'This todo does not belong to the user or does not exist',
      );
    return todo;
  }

  async getAll(data: TodoGetAll): Promise<Todo[]> {
    const todos = await this.prisma.todo.findMany({
      where: { userId: data.userId },
      orderBy: { order: 'asc' },
    });
    return todos;
  }

  async updateOrder(data: TodoUpdateOrder) {
    const { userId, id, order: newOrder } = data;

    const currentTodo = await this.get({ id, userId });

    if (newOrder == currentTodo.order) return currentTodo;

    const { canvaId } = currentTodo;

    const checkReplacement = await this.getTodoFromOrder({
      canvaId,
      order: newOrder,
    });

    if (!checkReplacement) {
      const todo = await this.prisma.todo.update({
        where: { id, userId },
        data: { order: newOrder },
      });
      return todo;
    }

    const [_, todo] = await this.prisma.$transaction([
      // Seçilen yerin alt sıralarındaki elementlerin sırası 1 arttırılıyor
      this.prisma.todo.updateMany({
        where: { userId, canvaId, order: { gte: newOrder } },
        data: { order: { increment: 1 } },
      }),
      // Seçilen yerin bir altındaki elementin sırası, sürüklenen elementin sırası oluyor
      this.prisma.todo.update({
        where: { id, userId },
        data: { order: newOrder },
      }),
    ]);
    return todo;
  }
}
