import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { User } from '../users/user.model.js';
import { UsersService } from '../users/users.service.js';

/**
 * СПРОЩЕНА автентифікація для розділу 3: паролі у відкритому вигляді, токени в пам’яті.
 * У розділі 7 її буде замінено на хешування паролів (bcrypt/argon2) і JWT.
 */
const DEMO_PASSWORDS: Record<string, string> = {
  'a.petrenko@college.example.ua': 'student123',
  'm.koval@college.example.ua': 'teacher123',
  'o.shevchuk@college.example.ua': 'admin123',
};

const TOKEN_TTL_SECONDS = 3600;

@Injectable()
export class AuthService {
  private readonly tokens = new Map<
    string,
    { userId: number; expiresAt: number }
  >();

  constructor(private readonly users: UsersService) {}

  login(email: string, password: string) {
    const user = this.users.findAll().find((u) => u.email === email);
    if (!user || DEMO_PASSWORDS[email] !== password) {
      throw new UnauthorizedException('Невірний email або пароль');
    }
    const accessToken = randomUUID();
    this.tokens.set(accessToken, {
      userId: user.id,
      expiresAt: Date.now() + TOKEN_TTL_SECONDS * 1000,
    });
    return {
      accessToken,
      tokenType: 'Bearer' as const,
      expiresIn: TOKEN_TTL_SECONDS,
    };
  }

  /** Повертає користувача за токеном або undefined (недійсний чи прострочений токен). */
  verify(token: string): User | undefined {
    const session = this.tokens.get(token);
    if (!session || session.expiresAt < Date.now()) return undefined;
    return this.users.find(session.userId);
  }
}
