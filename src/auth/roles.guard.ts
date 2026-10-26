import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Role } from '../users/user.model.js';
import type { AuthRequest } from './auth.types.js';
import { ROLES } from './roles.decorator.js';

/** Глобальний guard: перевіряє ролі з @Roles(). Виконується після AuthGuard. */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[] | undefined>(ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles || roles.length === 0) return true;
    const user = context.switchToHttp().getRequest<AuthRequest>().user;
    if (!user || !roles.includes(user.role)) {
      throw new ForbiddenException(`Потрібна роль: ${roles.join(' або ')}`);
    }
    return true;
  }
}
