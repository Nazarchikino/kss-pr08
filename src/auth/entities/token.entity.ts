import { ApiProperty } from '@nestjs/swagger';

/** Токен доступу, виданий після успішної автентифікації (схема для документації). */
export class TokenEntity {
  /**
   * Токен доступу для заголовка Authorization: Bearer <accessToken>
   * @example '2f1c9a54-8d3e-4b7a-9f1e-6c2d8a4b0e71'
   */
  accessToken: string;

  @ApiProperty({
    enum: ['Bearer'],
    description: 'Тип токена за схемою HTTP Bearer',
    example: 'Bearer',
  })
  tokenType: 'Bearer';

  /**
   * Час дії токена в секундах
   * @example 3600
   */
  expiresIn: number;
}
