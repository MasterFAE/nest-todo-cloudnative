import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(Logger);
  app.use(cookieParser());

  logger.verbose('[Auth Service]: API GATEWAY is up!');
  logger.verbose('[Auth Service]: API GATEWAY is up!');
  logger.verbose('[Auth Service]: API GATEWAY is up!');
  await app.listen(3000);
}
bootstrap();
