import { SharedModule, SharedService } from '@app/shared';
import { Logger, Module, Scope } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { PrismaModule } from '@app/prisma';
import { MicroService_HealthModule } from '@app/microservice-health';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { ConfigService } from '@nestjs/config';
import { GRPC_CANVA } from '@app/shared/types/service/canva';

@Module({
  imports: [
    SharedModule.registerGRPC([GRPC_CANVA]),
    SharedModule,
    PrismaModule,
    MicroService_HealthModule,
    PrometheusModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          defaultLabels: { app: 'todo' },
          path: configService.get('PROMETHEUS_METRIC_PATH'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [TodoController],
  providers: [TodoService, Logger, SharedService],
})
export class TodoModule {}
