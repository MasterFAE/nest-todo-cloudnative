import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { SharedModule } from '@app/shared';
import { GRPC_TODO } from '@app/shared/types/service/todo';

@Module({
  imports: [SharedModule.registerGRPC([GRPC_TODO])],
  controllers: [TodoController],
})
export class TodoModule {}
