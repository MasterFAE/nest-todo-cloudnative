import { PrismaService } from '@app/prisma';
import { ServiceException } from '@app/shared/exceptions/custom-service.exception';
import {
  CanvaCreate,
  CanvaDelete,
  CanvaUpdate,
  CanvaGetId,
  CanvaGetAll,
} from '@app/shared/types/service/canva';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { Injectable } from '@nestjs/common';
import { Canva } from '@prisma/client';

@Injectable()
export class CanvaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CanvaCreate): Promise<Canva> {
    const { userId, name } = data;
    const canva = await this.prisma.canva.create({
      data: {
        name,
        user: { connect: { id: userId } },
      },
    });

    return canva;
  }

  async delete(data: CanvaDelete): Promise<void> {
    const canva = await this.prisma.canva.findFirst({ where: data });
    if (!canva)
      throw new ServiceException(
        Status.PERMISSION_DENIED,
        'This canva does not belong to the user or does not exist',
      );
    await this.prisma.canva.delete({ where: { id: canva.id } });
  }

  async update(data: CanvaUpdate): Promise<Canva> {
    const { id, userId, name } = data;
    await this.get({ id, userId });

    const canva = await this.prisma.canva.update({
      where: { id, userId },
      data: { name },
    });

    return canva;
  }

  async get(data: CanvaGetId): Promise<Canva> {
    const canva = await this.prisma.canva.findFirst({ where: data });
    if (!canva)
      throw new ServiceException(
        Status.PERMISSION_DENIED,
        'This canva does not belong to the user or does not exist',
      );
    return canva;
  }

  async getAll(data: CanvaGetAll): Promise<Canva[]> {
    const canvas = await this.prisma.canva.findMany({
      where: { userId: data.userId },
    });
    return canvas;
  }
}
