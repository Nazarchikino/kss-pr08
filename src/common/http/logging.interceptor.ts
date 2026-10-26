import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  Logger,
  type NestInterceptor,
} from '@nestjs/common';
import type { Response } from 'express';
import { type Observable, tap } from 'rxjs';
import type { AuthRequest } from '../../auth/auth.types.js';

/**
 * Перехоплювач (interceptor): вимірює час обробки успішних запитів,
 * додає заголовок Server-Timing і пише рядок у журнал. Помилки журналює фільтр винятків.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const started = performance.now();
    const http = context.switchToHttp();
    const req = http.getRequest<AuthRequest>();
    const res = http.getResponse<Response>();
    const handler = `${context.getClass().name}.${context.getHandler().name}`;

    return next.handle().pipe(
      tap(() => {
        const ms = performance.now() - started;
        res.setHeader('Server-Timing', `app;dur=${ms.toFixed(1)}`);
        this.logger.log(
          `${req.method} ${req.originalUrl} → ${res.statusCode} ${ms.toFixed(1)} мс [${handler}] [${req.requestId}]`,
        );
      }),
    );
  }
}
