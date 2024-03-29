import { GRPC_TODO, ITodoServiceClient } from '@app/shared/types/service/todo';
import {
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { CreateTodoDto, UpdateTodoDto, UpdateTodoOrderDto } from './dto';
import { User } from '../lib/decorators/user.decorator';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Controller('todo')
export class TodoController implements OnModuleInit {
  private todoServer: ITodoServiceClient;

  constructor(@Inject(GRPC_TODO.serviceName) private client: ClientGrpc) {}

  onModuleInit() {
    this.todoServer = this.client.getService<ITodoServiceClient>(
      GRPC_TODO.serviceName,
    );
  }

  @Get()
  async getAll(@User('sub') userId) {
    try {
      const serverResponse = await firstValueFrom(
        this.todoServer.getAll({ userId }),
      );
      return serverResponse;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':id')
  async getId(@User('sub') userId, @Param('id') id) {
    try {
      const serverResponse = await firstValueFrom(
        this.todoServer.get({ id, userId }),
      );
      return serverResponse;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Post('')
  async create(@User('sub') userId, @Body() data: CreateTodoDto) {
    try {
      const serverResponse = await firstValueFrom(
        this.todoServer.create({ ...data, userId }),
      );
      return serverResponse;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Put('')
  async update(@User('sub') userId, @Body() data: UpdateTodoDto) {
    try {
      const serverResponse = await firstValueFrom(
        this.todoServer.update({ ...data, userId }),
      );
      return serverResponse;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Put('order')
  async updateOrder(@User('sub') userId, @Body() data: UpdateTodoOrderDto) {
    try {
      const serverResponse = await firstValueFrom(
        this.todoServer.updateOrder({ ...data, userId }),
      );
      return serverResponse;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  async delete(@User('sub') userId, @Param('id') id) {
    try {
      await firstValueFrom(this.todoServer.delete({ id, userId }));
      return 'Successful';
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
