import { SharedModule, SharedService } from '@app/shared';
import { Logger, Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { PrismaModule } from '@app/prisma';
import { MicroService_HealthModule } from '@app/microservice-health';

@Module({
  imports: [SharedModule, PrismaModule, MicroService_HealthModule],
  controllers: [TodoController],
  providers: [TodoService, Logger, SharedService],
})
export class TodoModule {}
