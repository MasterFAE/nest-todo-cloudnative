import { Module } from '@nestjs/common';
import { CanvaController } from './canva.controller';
import { GRPC_CANVA } from '@app/shared/types/service/canva';
import { SharedModule } from '@app/shared';

@Module({
  imports: [SharedModule.registerGRPC([GRPC_CANVA])],
  controllers: [CanvaController],
})
export class CanvaModule {}
