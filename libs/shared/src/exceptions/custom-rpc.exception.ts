import { Status } from '@grpc/grpc-js/build/src/constants';
import { RpcException } from '@nestjs/microservices';

/**
 * Creates custom rpc exception.
 * default Status.UNKNOWN
 * @param code - Status
 **/
export class CustomRpcException extends RpcException {
  constructor(code: Status = 2, message?: string) {
    super({ code, message: message ?? null });
  }
}
