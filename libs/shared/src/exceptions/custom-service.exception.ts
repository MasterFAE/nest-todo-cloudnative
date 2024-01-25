import { Status } from '@grpc/grpc-js/build/src/constants';

/**
 * Creates custom service exception.
 * default Status.UNKNOWN
 * @param code - Status
 **/
export class ServiceException extends Error {
  code: number;
  message: string;
  constructor(code: Status = Status.UNKNOWN, message?: string) {
    super(message);
    this.code = code;
    this.message = message;
    this.name = 'ServiceException';
  }
}
