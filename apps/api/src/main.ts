import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(Logger);
  const configService = app.get(ConfigService);
  const port = configService.get('API_HTTP_PORT');

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(port);

  logger.verbose('------------------------------------');
  logger.verbose(`[API GATEWAY]: API GATEWAY is up at ${port}!`);
  logger.verbose('------------------------------------');
}
bootstrap();
