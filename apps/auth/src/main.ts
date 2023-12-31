import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions } from '@nestjs/microservices';
import { SharedService } from '@app/shared';
import { Logger, ValidationPipe } from '@nestjs/common';
import { GRPC_AUTH } from '@app/shared/types/service/auth';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);
  const sharedService = app.get(SharedService);
  const logger = app.get(Logger);
  const AUTH_QUEUE = configService.get('RABBITMQ_AUTH_QUEUE');

  app.useLogger(logger);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // app.connectMicroservice<MicroserviceOptions>(
  //   sharedService.getRmqOptions(AUTH_QUEUE),
  // );

  app.connectMicroservice<MicroserviceOptions>(
    sharedService.getGrpcOptions(GRPC_AUTH),
  );
  await app.startAllMicroservices();

  logger.verbose('------------------------------------');
  logger.verbose('[Auth Service]: Auth Service is up!');
  logger.verbose('------------------------------------');
}
bootstrap();
