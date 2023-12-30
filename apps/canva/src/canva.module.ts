import { Logger, Module } from '@nestjs/common';
import { CanvaController } from './canva.controller';
import { CanvaService } from './canva.service';
import { PrismaModule } from '@app/prisma';
import { SharedModule, SharedService } from '@app/shared';

@Module({
  imports: [PrismaModule, SharedModule],
  controllers: [CanvaController],
  providers: [CanvaService, Logger, SharedService],
})
export class CanvaModule {}
