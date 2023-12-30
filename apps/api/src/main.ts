import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(Logger);
  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(3000);

  logger.verbose('------------------------------------');
  logger.verbose('[API GATEWAY]: API GATEWAY is up!');
  logger.verbose('------------------------------------');
}
bootstrap();
