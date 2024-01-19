import { Logger, Module } from '@nestjs/common';
import { CanvaController } from './canva.controller';
import { CanvaService } from './canva.service';
import { PrismaModule } from '@app/prisma';
import { SharedModule, SharedService } from '@app/shared';
import { MicroService_HealthModule } from '@app/microservice-health';

@Module({
  imports: [PrismaModule, SharedModule, MicroService_HealthModule],
  controllers: [CanvaController],
  providers: [CanvaService, Logger, SharedService],
})
export class CanvaModule {}
