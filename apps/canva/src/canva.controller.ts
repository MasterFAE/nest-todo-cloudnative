import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { CanvaService } from './canva.service';
import { RpcException } from '@nestjs/microservices';
import { Canva } from '@prisma/client';
import {
  ICanvaServiceController,
  CanvaCreate,
  CanvaDelete,
  CanvaUpdate,
  CanvaGetId,
  CanvaGetAll,
  Canvas,
  CanvaServiceControllerMethods,
} from '@app/shared/types/service/canva';
import serviceExceptionGenerator from '@app/shared/helper/functions/serviceExceptionGenerator';
import { GrpcLoggingInterceptor } from '@app/shared/interceptors/grpc-logging.interceptor';

@Controller()
@CanvaServiceControllerMethods()
@UseInterceptors(new GrpcLoggingInterceptor(new Logger()))
export class CanvaController implements ICanvaServiceController {
  constructor(private readonly canvaService: CanvaService) {}

  async create(data: CanvaCreate): Promise<Canva> {
    try {
      const canva = await this.canvaService.create(data);
      return canva;
    } catch (er) {
      const { error } = serviceExceptionGenerator(er);
      throw new RpcException(error);
    }
  }

  async delete(data: CanvaDelete): Promise<void> {
    try {
      await this.canvaService.delete(data);
    } catch (er) {
      const { error } = serviceExceptionGenerator(er);
      throw new RpcException(error);
    }
  }

  async update(data: CanvaUpdate): Promise<Canva> {
    try {
      const canva = await this.canvaService.update(data);
      return canva;
    } catch (er) {
      const { error } = serviceExceptionGenerator(er);
      throw new RpcException(error);
    }
  }

  async get(data: CanvaGetId): Promise<Canva> {
    try {
      const canva = await this.canvaService.get(data);
      return canva;
    } catch (er) {
      const { error } = serviceExceptionGenerator(er);
      throw new RpcException(error);
    }
  }

  async getAll(data: CanvaGetAll): Promise<Canvas> {
    try {
      const canvas = await this.canvaService.getAll(data);
      return { canvas };
    } catch (er) {
      const { error } = serviceExceptionGenerator(er);
      throw new RpcException(error);
    }
  }
}
