import { SharedModule, SharedService } from '@app/shared';
import { Logger, Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { PrismaModule } from '@app/prisma';

@Module({
  imports: [SharedModule, PrismaModule],
  controllers: [TodoController],
  providers: [TodoService, Logger, SharedService],
})
export class TodoModule {}
