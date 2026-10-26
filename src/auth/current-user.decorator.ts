import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { User } from '../users/user.model.js';
import type { AuthRequest } from './auth.types.js';

/** Параметр обробника: користувач, якого встановив AuthGuard. */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User => {
    return ctx.switchToHttp().getRequest<AuthRequest>().user as User;
  },
);
