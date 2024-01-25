import { Logger, Module } from '@nestjs/common';
import { SharedModule } from '@app/shared';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { GrpcErrorInterceptor } from './grpc-exception.interceptor';
import { TodoModule } from './todo/todo.module';
import { GRPC_AUTH } from '@app/shared/types/service/auth';
import { CanvaModule } from './canva/canva.module';
import { HealthModule } from './health/health.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './lib/guards/auth.guard';

@Module({
  imports: [
    HealthModule,
    TodoModule,
    AuthModule,
    CanvaModule,
    SharedModule.registerRMQ('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    SharedModule.registerGRPC([GRPC_AUTH]),
    PrometheusModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          defaultLabels: { app: 'api' },
          path: configService.get('PROMETHEUS_METRIC_PATH'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_INTERCEPTOR, useClass: GrpcErrorInterceptor },
    Logger,
  ],
})
export class AppModule {}
