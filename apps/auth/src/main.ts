import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { GRPC_PACKAGE, SharedService } from '@app/shared';
import { Logger } from '@nestjs/common';
import { GRPC_AUTH } from '@app/shared/types/service/auth';
import { GRPC_HEALTH } from '@app/shared/types/service/health';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const sharedService = app.get(SharedService);
  const logger = app.get(Logger);
  // const AUTH_QUEUE = configService.get('RABBITMQ_AUTH_QUEUE');
  const grpcPackageOptions = GRPC_AUTH;

  app.useLogger(logger);

  app.connectMicroservice<MicroserviceOptions>(
    sharedService.getGrpcOptions(grpcPackageOptions),
  );

  // app.connectMicroservice<MicroserviceOptions>(
  //   sharedService.getRmqOptions(AUTH_QUEUE),
  // );

  const healthPackage: GRPC_PACKAGE = {
    ...GRPC_HEALTH,
    host: grpcPackageOptions.host,
  };
  app.connectMicroservice<MicroserviceOptions>(
    sharedService.getGrpcOptions(healthPackage),
  );

  await app.startAllMicroservices();
  await app.listen(grpcPackageOptions.httpPort);

  app.useLogger(logger);

  logger.verbose('------------------------------------');
  logger.verbose('[Auth Service]: Auth Service is up!');
  logger.verbose(`[Auth Service]: HOST: ${grpcPackageOptions.host}`);
  logger.verbose(`[Auth Service]: GRPC: ${grpcPackageOptions.port}`);
  logger.verbose(`[Auth Service]: HTTP: ${grpcPackageOptions.httpPort}`);
  logger.verbose(`[Auth Service]: HEALTH: ${healthPackage.port}`);
  logger.verbose('------------------------------------');
}
bootstrap();
