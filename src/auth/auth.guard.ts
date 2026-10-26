import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service.js';
import type { AuthRequest } from './auth.types.js';
import { IS_PUBLIC } from './public.decorator.js';

/** Глобальний guard: вимагає заголовок Authorization: Bearer <токен>, крім маршрутів @Public(). */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly auth: AuthService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<AuthRequest>();
    const [scheme, token] = (request.headers.authorization ?? '').split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException(
        'Потрібен заголовок Authorization: Bearer <токен>',
      );
    }
    const user = this.auth.verify(token);
    if (!user)
      throw new UnauthorizedException('Токен недійсний або прострочений');
    request.user = user;
    return true;
  }
}
