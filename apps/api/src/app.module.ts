import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GRPC_AUTH, GRPC_EXAMPLE, SharedModule } from '@app/shared';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from '@app/shared/guards/auth.guard';
import { AuthModule } from './auth/auth.module';
import { GrpcErrorInterceptor } from './grpc-exception.interceptor';
import { ExampleModule } from './example/example.module';

@Module({
  imports: [
    AuthModule,
    ExampleModule,
    SharedModule.registerRMQ('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    SharedModule.registerGRPC([GRPC_AUTH, GRPC_EXAMPLE]),
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_INTERCEPTOR, useClass: GrpcErrorInterceptor },
    Logger,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
