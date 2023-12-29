import {
  CreateExampleDto,
  DeleteExampleDto,
  Empty,
  Example,
  Examples,
  GetExampleById,
  IExampleServiceClient,
  UpdateExampleDto,
} from '@app/shared';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ExampleService implements IExampleServiceClient {
  create(request: CreateExampleDto): Observable<Example> {
    throw new Error('Method not implemented.');
  }
  get(request: GetExampleById): Observable<Example> {
    throw new Error('Method not implemented.');
  }
  getAll(request: Empty): Observable<Examples> {
    throw new Error('Method not implemented.');
  }
  update(request: UpdateExampleDto): Observable<Example> {
    throw new Error('Method not implemented.');
  }
  delete(request: DeleteExampleDto): Observable<Empty> {
    throw new Error('Method not implemented.');
  }
}
