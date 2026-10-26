import { Injectable, type NestMiddleware } from '@nestjs/common';
import type { NextFunction, Response } from 'express';
import { randomUUID } from 'node:crypto';
import type { AuthRequest } from '../../auth/auth.types.js';

const VALID_ID = /^[\w-]{8,64}$/;

/**
 * Посередник (middleware): присвоює запиту ідентифікатор для кореляції журналів.
 * Якщо клієнт або проксі вже передав коректний X-Request-Id – використовує його.
 */
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: AuthRequest, res: Response, next: NextFunction): void {
    const incoming = req.header('x-request-id');
    req.requestId =
      incoming && VALID_ID.test(incoming) ? incoming : randomUUID();
    res.setHeader('X-Request-Id', req.requestId);
    next();
  }
}
