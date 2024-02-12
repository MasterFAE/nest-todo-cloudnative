import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { tap } from "rxjs/operators";

@Injectable()
export class RequestLoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const now = Date.now();
    const user = request.user ? request.user.sub : 'Anonymous';

    return next.handle().pipe(tap(() => {
      this.logger.log(
        `[${Date.now() - now}ms][${method} ${url}] ${user} ${request.headers['user-agent']}`,
        context.getClass().name,
      );
    }));

  }
}