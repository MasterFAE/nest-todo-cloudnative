import { User } from '@app/shared/decorators/user.decorator';

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
  UseGuards,
} from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { CreateCanvaDto, UpdateCanvaDto } from './dto';
import {
  GRPC_CANVA,
  ICanvaServiceClient,
} from '@app/shared/types/service/canva';

@Controller('canva')
export class CanvaController implements OnModuleInit {
  private canvaServer: ICanvaServiceClient;

  constructor(@Inject(GRPC_CANVA.serviceName) private client: ClientGrpc) {}

  onModuleInit() {
    this.canvaServer = this.client.getService<ICanvaServiceClient>(
      GRPC_CANVA.serviceName,
    );
  }

  @Get()
  async getAll(@User('sub') userId) {
    try {
      const serverResponse = await firstValueFrom(
        this.canvaServer.getAll({ userId }),
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
        this.canvaServer.get({ id, userId }),
      );
      return serverResponse;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Post('')
  async create(@User('sub') userId, @Body() data: CreateCanvaDto) {
    try {
      const serverResponse = await firstValueFrom(
        this.canvaServer.create({ name: data.name, userId }),
      );
      return serverResponse;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Put('')
  async update(@User('sub') userId, @Body() data: UpdateCanvaDto) {
    try {
      const serverResponse = await firstValueFrom(
        this.canvaServer.update({ ...data, userId }),
      );
      return serverResponse;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  async delete(@User('sub') userId, @Param('id') id) {
    try {
      await firstValueFrom(this.canvaServer.delete({ id, userId }));
      return 'Successful';
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
