import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { STATUS_CODES } from 'node:http';
import type { AuthRequest } from '../../auth/auth.types.js';

/** Тіло відповіді з помилкою за RFC 9457 (Problem Details for HTTP APIs). */
export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance: string;
  requestId?: string;
  [extension: string]: unknown;
}

const TITLES: Record<number, string> = {
  400: 'Некоректний запит',
  401: 'Потрібна автентифікація',
  403: 'Доступ заборонено',
  404: 'Ресурс не знайдено',
  409: 'Конфлікт стану',
  422: 'Помилка валідації',
  500: 'Внутрішня помилка сервера',
};

/**
 * Глобальний фільтр винятків: будь-яку помилку перетворює на application/problem+json.
 * Непередбачені помилки (не HttpException) – 500 без подробиць для клієнта, з повним стеком у журналі.
 */
@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exceptions');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<AuthRequest>();
    const res = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let detail =
      'Сталася непередбачена помилка. Повідомте ідентифікатор запиту адміністратору.';
    let extensions: Record<string, unknown> = {};

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();
      if (typeof body === 'string') {
        detail = body;
      } else {
        const {
          message,
          statusCode: _s,
          error: _e,
          ...rest
        } = body as Record<string, unknown>;
        detail = Array.isArray(message)
          ? message.join('; ')
          : typeof message === 'string'
            ? message
            : exception.message;
        extensions = rest;
      }
    }

    const problem: ProblemDetails = {
      type: 'about:blank',
      title: TITLES[status] ?? STATUS_CODES[status] ?? 'Помилка',
      status,
      detail,
      instance: req.originalUrl,
      requestId: req.requestId,
      ...extensions,
    };

    if (status >= 500) {
      this.logger.error(
        `${req.method} ${req.originalUrl} → ${status} [${req.requestId}]`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else {
      this.logger.warn(
        `${req.method} ${req.originalUrl} → ${status}: ${detail} [${req.requestId}]`,
      );
    }

    if (status === 401)
      res.setHeader('WWW-Authenticate', 'Bearer realm="helpdesk"');
    res.status(status).type('application/problem+json').json(problem);
  }
}
