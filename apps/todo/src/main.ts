import { NestFactory } from '@nestjs/core';
import { TodoModule } from './todo.module';
import { GRPC_PACKAGE, SharedService } from '@app/shared';
import { Logger } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions } from '@nestjs/microservices';
import { GRPC_TODO } from '@app/shared/types/service/todo';
import { GRPC_HEALTH } from '@app/shared/types/service/health';

async function bootstrap() {
  const app = await NestFactory.create(TodoModule);
  const sharedService = app.get(SharedService);
  const logger = app.get(Logger);

  const grpcPackageOptions = GRPC_TODO;
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
  logger.verbose('[Todo Service]: Todo Service is up!');
  logger.verbose(`[Todo Service]: HOST: ${grpcPackageOptions.host}`);
  logger.verbose(`[Todo Service]: GRPC: ${grpcPackageOptions.port}`);
  logger.verbose(`[Todo Service]: HTTP: ${grpcPackageOptions.httpPort}`);
  logger.verbose(`[Todo Service]: HEALTH: ${healthPackage.port}`);
  logger.verbose('------------------------------------');
}
bootstrap();
