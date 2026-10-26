import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC = 'isPublic';

/** Маршрут доступний без автентифікації (AuthGuard його пропускає). */
export const Public = () => SetMetadata(IS_PUBLIC, true);
