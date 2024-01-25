import { PrismaService } from '@app/prisma';
import { CustomRpcException } from '@app/shared/exceptions/custom-rpc.exception';
import { ServiceException } from '@app/shared/exceptions/custom-service.exception';
import {
  GRPC_CANVA,
  ICanvaServiceClient,
} from '@app/shared/types/service/canva';
import {
  TodoCreate,
  TodoDelete,
  TodoUpdate,
  TodoGetId,
  TodoGetAll,
  TodoUpdateOrder,
} from '@app/shared/types/service/todo';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Canva, Todo } from '@prisma/client';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Injectable()
export class TodoService {
  private canvaServer: ICanvaServiceClient;
  constructor(
    private readonly prisma: PrismaService,
    @Inject(GRPC_CANVA.serviceName) private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.canvaServer = this.client.getService<ICanvaServiceClient>(
      GRPC_CANVA.serviceName,
    );
  }

  async getCanva(canvaId: string, userId: string): Promise<Canva> {
    try {
      const canva = await firstValueFrom(
        this.canvaServer.get({ id: canvaId, userId }),
      );
      return canva;
    } catch (error) {
      throw new ServiceException(Status.NOT_FOUND, 'Canva not found');
    }
  }

  async create(data: TodoCreate): Promise<Todo> {
    let { userId, canvaId, ...todoData } = data;
    const canva = await this.getCanva(canvaId, userId);
    canvaId = canva.id;
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
      throw new ServiceException(
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
