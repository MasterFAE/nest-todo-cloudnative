import { Controller, Get } from '@nestjs/common';
import {
  GRPCHealthIndicator,
  HealthCheck,
  HealthCheckService,
} from '@nestjs/terminus';
import { GrpcOptions } from '@nestjs/microservices';
import { GRPC_AUTH } from '@app/shared/types/service/auth';
import { join } from 'path';
import { GRPC_HEALTH } from '@app/shared/types/service/health';
import { GRPC_CANVA } from '@app/shared/types/service/canva';
import { GRPC_TODO } from '@app/shared/types/service/todo';
import { Public } from '../lib/decorators/public.decorator';

@Controller('health')
export class HealthController {
  constructor(
    private readonly grpcHealth: GRPCHealthIndicator,
    private readonly health: HealthCheckService,
  ) {}

  @Get()
  @Public()
  @HealthCheck()
  check() {
    return this.health.check([
      () =>
        this.grpcHealth.checkService<GrpcOptions>(
          GRPC_AUTH.packageName,
          'auth.health.v1',
          {
            package: 'grpc.health.v1',
            protoPath: join(__dirname, '../health.proto'),
            timeout: 10000,
            url: `${GRPC_AUTH.host}:${GRPC_HEALTH.port}`,
          },
        ),
      () =>
        this.grpcHealth.checkService<GrpcOptions>(
          GRPC_CANVA.packageName,
          'canva.health.v1',
          {
            package: 'grpc.health.v1',
            protoPath: join(__dirname, '../health.proto'),
            timeout: 10000,
            url: `${GRPC_CANVA.host}:${GRPC_HEALTH.port}`,
          },
        ),
      () =>
        this.grpcHealth.checkService<GrpcOptions>(
          GRPC_TODO.packageName,
          'todo.health.v1',
          {
            package: 'grpc.health.v1',
            protoPath: join(__dirname, '../health.proto'),
            timeout: 10000,
            url: `${GRPC_TODO.host}:${GRPC_HEALTH.port}`,
          },
        ),
    ]);
  }
}
