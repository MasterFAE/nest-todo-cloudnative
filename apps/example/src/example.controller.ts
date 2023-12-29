import { Controller, Get } from '@nestjs/common';
import { ExampleService } from './example.service';
import {
  CreateExampleDto,
  DeleteExampleDto,
  Empty,
  Example,
  ExampleServiceControllerMethods,
  Examples,
  GetExampleById,
  IExampleServiceController,
  UpdateExampleDto,
} from '@app/shared';
import { Observable } from 'rxjs';

@Controller()
@ExampleServiceControllerMethods()
export class ExampleController implements IExampleServiceController {
  constructor(private readonly exampleService: ExampleService) {}

  create(
    request: CreateExampleDto,
  ): Example | Observable<Example> | Promise<Example> {
    throw new Error('Method not implemented.');
  }
  get(
    request: GetExampleById,
  ): Example | Observable<Example> | Promise<Example> {
    throw new Error('Method not implemented.');
  }
  getAll(
    request: Empty,
  ): Examples | Observable<Examples> | Promise<Examples> | any {
    return 'TESTTT';
  }
  update(
    request: UpdateExampleDto,
  ): Example | Observable<Example> | Promise<Example> {
    throw new Error('Method not implemented.');
  }
  delete(
    request: DeleteExampleDto,
  ): Empty | Observable<Empty> | Promise<Empty> {
    throw new Error('Method not implemented.');
  }
}
