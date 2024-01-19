import { NestFactory } from '@nestjs/core';
import { CanvaModule } from './canva.module';
import { GRPC_PACKAGE, SharedService } from '@app/shared';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';
import { GRPC_CANVA } from '@app/shared/types/service/canva';
import { GRPC_HEALTH } from '@app/shared/types/service/health';

async function bootstrap() {
  const app = await NestFactory.create(CanvaModule);
  const sharedService = app.get(SharedService);
  const logger = app.get(Logger);

  app.useLogger(logger);

  app.connectMicroservice<MicroserviceOptions>(
    sharedService.getGrpcOptions(GRPC_CANVA),
  );

  const healthPackage: GRPC_PACKAGE = { ...GRPC_HEALTH, host: GRPC_CANVA.host };
  app.connectMicroservice<MicroserviceOptions>(
    sharedService.getGrpcOptions(healthPackage),
  );

  await app.startAllMicroservices();

  logger.verbose('------------------------------------');
  logger.verbose('[Canva Service]: Canva Service is up!');
  logger.verbose('------------------------------------');
}
bootstrap();
