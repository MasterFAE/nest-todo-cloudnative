import {
  Injectable,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable()
export class GrpcLoggingInterceptor {
  constructor(private readonly logger: Logger) {}
  intercept(context: ExecutionContext, next: CallHandler) {
    if (context.getType() !== 'rpc') return next.handle();
    const start = Date.now();
    const request = context.switchToRpc();
    const userId = request.getData().userId;
    const userAgent = request.getContext().get('user-agent');
    const correlationKey = uuidv4();
    return next.handle().pipe(
      tap({
        next: (data) => {
          try {
            const responseLength = Buffer.from(
              JSON.stringify(data) ?? '',
            ).length;
            const logMessage = this.getLogMessage({
              start,
              correlationKey,
              context,
              userId,
              userAgent,
            });
            this.logger.log(logMessage + ` ${responseLength}B`);
          } catch (error) {
            console.log({ error });
          }
        },
        error: ({ error }) => {
          const logMessage = this.getLogMessage({
            start,
            correlationKey,
            context,
            userId,
            userAgent,
          });
          const errType = Status[error.code];
          error.code != Status.INTERNAL
            ? this.logger.warn(`${errType}: ${logMessage}`)
            : this.logger.error(`${errType}: ${logMessage}`);
          return throwError(() => new RpcException(error));
        },
      }),
    );
  }

  getLogMessage({ start, correlationKey, context, userId, userAgent }) {
    return `[${Date.now() - start}ms][${correlationKey}] ${
      context.getClass().name
    }/${context.getHandler().name} ${userId ?? 'UNKNOWN'} ${userAgent}`;
  }
}
