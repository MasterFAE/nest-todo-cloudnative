import { Module } from '@nestjs/common';
import { ExampleController } from './example.controller';
import { GRPC_EXAMPLE, SharedModule } from '@app/shared';

@Module({
  controllers: [ExampleController],
  imports: [SharedModule.registerGRPC([GRPC_EXAMPLE])],
})
export class ExampleModule {}
