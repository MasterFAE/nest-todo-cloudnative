import { GrpcOptions, RmqOptions } from '@nestjs/microservices';
import { GRPC_PACKAGE } from '../types';

export default interface ISharedService {
  getRmqOptions(queue: string): RmqOptions;
  getGrpcServerOptions(data: GRPC_PACKAGE): GrpcOptions;
  acknowledgeMessage(context: any): void;
}
