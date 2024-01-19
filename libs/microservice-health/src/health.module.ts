import { ConsoleLogger, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '@app/prisma';
import { MicroService_HealthController } from './health.controller';

@Module({
  controllers: [MicroService_HealthController],
  imports: [
    PrismaModule,
    TerminusModule.forRoot({
      logger: ConsoleLogger,
      errorLogStyle: 'pretty',
      gracefulShutdownTimeoutMs: 1000,
    }),
    HttpModule,
  ],
})
export class MicroService_HealthModule {}
