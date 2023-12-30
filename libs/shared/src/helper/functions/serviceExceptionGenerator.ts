import {
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { CustomRpcException } from '../../exceptions/custom-rpc.exception';
import { Status } from '@grpc/grpc-js/build/src/constants';

export default (error): any => {
  if (error instanceof CustomRpcException) return error;

  if (error instanceof PrismaClientValidationError)
    return new CustomRpcException(Status.INVALID_ARGUMENT, error.toString());

  if (error instanceof PrismaClientKnownRequestError)
    return new CustomRpcException(Status.INTERNAL, error.toString());

  if (error instanceof PrismaClientUnknownRequestError)
    return new CustomRpcException(Status.INTERNAL, error.toString());

  if (error instanceof PrismaClientRustPanicError)
    return new CustomRpcException(Status.INTERNAL, error.toString());
};
