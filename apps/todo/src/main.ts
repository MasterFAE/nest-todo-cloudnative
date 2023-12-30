import { NestFactory } from '@nestjs/core';
import { TodoModule } from './todo.module';
import { SharedService } from '@app/shared';
import { Logger } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions } from '@nestjs/microservices';
import { GRPC_TODO } from '@app/shared/types/service/todo';

async function bootstrap() {
  const app = await NestFactory.create(TodoModule);
  const sharedService = app.get(SharedService);
  const logger = app.get(Logger);

  app.useLogger(logger);

  app.connectMicroservice<MicroserviceOptions>(
    sharedService.getGrpcOptions(GRPC_TODO),
  );
  await app.startAllMicroservices();

  logger.verbose('------------------------------------');
  logger.verbose('[Todo Service]: Todo Service is up!');
  logger.verbose('------------------------------------');
}
bootstrap();
