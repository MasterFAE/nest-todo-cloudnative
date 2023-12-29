import { GRPC_EXAMPLE, IExampleServiceClient } from '@app/shared';
import { Public } from '@app/shared/decorators/public.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Controller('example')
export class ExampleController implements OnModuleInit {
  private exampleService: IExampleServiceClient;
  constructor(@Inject(GRPC_EXAMPLE.serviceName) private client: ClientGrpc) {}

  onModuleInit() {
    this.exampleService = this.client.getService<IExampleServiceClient>(
      GRPC_EXAMPLE.serviceName,
    );
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.exampleService.get({ id });
  }

  @Public()
  @Get('')
  getAll() {
    return this.exampleService.getAll({});
  }

  @Post('')
  create(@Body() data) {
    return this.exampleService.create(data);
  }

  @Patch('')
  update(@Body() data) {
    return this.exampleService.update(data);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.exampleService.delete({ id });
  }
}
