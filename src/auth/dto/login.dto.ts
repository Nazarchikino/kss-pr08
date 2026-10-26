import { IsEmail, IsString, MinLength } from 'class-validator';

/** Облікові дані для входу в систему. */
export class LoginDto {
  /**
   * Електронна пошта користувача коледжу
   * @example 'a.petrenko@college.example.ua'
   */
  @IsEmail()
  email: string;

  /**
   * Пароль користувача (щонайменше 8 символів)
   * @example 'student123'
   */
  @IsString()
  @MinLength(8)
  password: string;
}
