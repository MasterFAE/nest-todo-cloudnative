import { ConsoleLogger, Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [HealthController],
  imports: [
    TerminusModule.forRoot({
      logger: ConsoleLogger,
      errorLogStyle: 'pretty',
      gracefulShutdownTimeoutMs: 2000,
    }),
    HttpModule,
  ],
})
export class HealthModule {}
