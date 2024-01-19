import { Logger, Module } from '@nestjs/common';
import { SharedModule } from '@app/shared';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from '@app/shared/guards/auth.guard';
import { AuthModule } from './auth/auth.module';
import { GrpcErrorInterceptor } from './grpc-exception.interceptor';
import { TodoModule } from './todo/todo.module';
import { GRPC_AUTH } from '@app/shared/types/service/auth';
import { CanvaModule } from './canva/canva.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    HealthModule,
    TodoModule,
    AuthModule,
    CanvaModule,
    SharedModule.registerRMQ('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    SharedModule.registerGRPC([GRPC_AUTH]),
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_INTERCEPTOR, useClass: GrpcErrorInterceptor },
    Logger,
  ],
})
export class AppModule {}
