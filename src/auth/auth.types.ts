import type { Request } from 'express';
import type { User } from '../users/user.model.js';

/** Запит після проходження AuthGuard: містить користувача та ідентифікатор запиту. */
export interface AuthRequest extends Request {
  user?: User;
  requestId?: string;
}
