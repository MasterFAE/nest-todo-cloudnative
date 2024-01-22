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

  const grpcPackageOptions = GRPC_CANVA;
  app.useLogger(logger);

  app.connectMicroservice<MicroserviceOptions>(
    sharedService.getGrpcOptions(grpcPackageOptions),
  );

  const healthPackage: GRPC_PACKAGE = {
    ...GRPC_HEALTH,
    host: grpcPackageOptions.host,
  };
  app.connectMicroservice<MicroserviceOptions>(
    sharedService.getGrpcOptions(healthPackage),
  );

  await app.startAllMicroservices();
  await app.listen(grpcPackageOptions.httpPort);

  logger.verbose('------------------------------------');
  logger.verbose('[Canva Service]: Canva Service is up!');
  logger.verbose('------------------------------------');
}
bootstrap();
