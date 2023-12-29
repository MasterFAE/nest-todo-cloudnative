import { GRPC_AUTH, GRPC_EXAMPLE, SharedModule } from '@app/shared';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    SharedModule.registerRMQ('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    SharedModule.registerGRPC([GRPC_AUTH]),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
