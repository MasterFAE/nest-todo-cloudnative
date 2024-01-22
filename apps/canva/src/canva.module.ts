import { Logger, Module } from '@nestjs/common';
import { CanvaController } from './canva.controller';
import { CanvaService } from './canva.service';
import { PrismaModule } from '@app/prisma';
import { SharedModule, SharedService } from '@app/shared';
import { MicroService_HealthModule } from '@app/microservice-health';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    SharedModule,
    MicroService_HealthModule,
    PrometheusModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          defaultLabels: { app: 'canva' },
          path: configService.get('PROMETHEUS_METRIC_PATH'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [CanvaController],
  providers: [CanvaService, Logger, SharedService],
})
export class CanvaModule {}
