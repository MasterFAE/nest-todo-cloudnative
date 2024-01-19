import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  DiskHealthIndicator,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '@app/prisma';
import { GrpcMethod } from '@nestjs/microservices';
import {
  HealthCheckResponse,
  ServingStatus,
} from '@app/shared/types/service/health';

@Controller()
export class MicroService_HealthController {
  private readonly MAX_DISK_STORAGE = 250 * 1024 * 1024 * 1024;

  constructor(
    private readonly prisma: PrismaService,
    private readonly prismaHealth: PrismaHealthIndicator,
    private readonly http: HttpHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
  ) {}

  @GrpcMethod('Health', 'Check')
  async check(): Promise<HealthCheckResponse> {
    try {
      await Promise.all([
        this.prismaHealth.pingCheck('prisma', this.prisma),
        this.http.pingCheck('http', 'https://google.com'),
        this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
        this.disk.checkStorage('storage', {
          path: process.platform == 'win32' ? 'C:\\' : '/',
          threshold: this.MAX_DISK_STORAGE,
        }),
      ]);
      return { status: ServingStatus.SERVING };
    } catch (error) {
      return {
        status: ServingStatus.NOT_SERVING,
      };
    }
  }
}
