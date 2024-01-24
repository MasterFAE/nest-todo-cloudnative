import { Controller, Get, Logger } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  DiskHealthIndicator,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
  HealthCheck,
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
  private readonly conditionArray = [
    this.prismaHealth.pingCheck('prisma', this.prisma, { timeout: 10000 }),
    this.http.pingCheck('http', 'https://google.com'),
    this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    this.disk.checkStorage('storage', {
      path: process.platform == 'win32' ? 'C:\\' : '/',
      threshold: this.MAX_DISK_STORAGE,
    }),
  ];

  constructor(
    private health: HealthCheckService,
    private readonly prisma: PrismaService,
    private readonly prismaHealth: PrismaHealthIndicator,
    private readonly http: HttpHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly logger: Logger,
  ) {}

  @Get('health')
  @HealthCheck()
  async checkHealth() {
    return this.health.check(this.conditionArray.map((item) => () => item));
  }
  @GrpcMethod('Health', 'Check')
  async check(): Promise<HealthCheckResponse> {
    try {
      await Promise.all(this.conditionArray);
      return { status: ServingStatus.SERVING };
    } catch (error) {
      console.log('ERROR OCCURRED WHILE CHECKING HEALTH');
      console.log({ error });
      this.logger.error(error);
      return {
        status: ServingStatus.NOT_SERVING,
      };
    }
  }
}
