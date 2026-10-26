import { SetMetadata } from '@nestjs/common';
import type { Role } from '../users/user.model.js';

export const ROLES = 'roles';

/** Маршрут доступний лише користувачам із переліченими ролями (перевіряє RolesGuard). */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES, roles);
