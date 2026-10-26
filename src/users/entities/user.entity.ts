import { ApiProperty } from '@nestjs/swagger';
import type { Role, User } from '../user.model.js';

export const ROLES: readonly Role[] = ['student', 'teacher', 'admin'];

/** Користувач інформаційної системи служби технічної підтримки (схема для документації). */
export class UserEntity implements User {
  /**
   * Унікальний ідентифікатор користувача
   * @example 1
   */
  readonly id: number;

  /**
   * Прізвище та ім’я користувача
   * @example 'Петренко Аліна'
   */
  fullName: string;

  /**
   * Корпоративна електронна пошта
   * @example 'a.petrenko@college.example.ua'
   */
  email: string;

  @ApiProperty({
    enum: ROLES,
    enumName: 'Role',
    description: 'Роль користувача в системі',
    example: 'student',
  })
  role: Role;
}
