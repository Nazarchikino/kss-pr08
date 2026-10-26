import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  IsIn,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { PRIORITIES, type Priority } from '../ticket.model.js';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

/** Дані для створення нової заявки до служби технічної підтримки. */
export class CreateTicketDto {
  /**
   * Короткий заголовок проблеми (від 1 до 80 символів)
   * @example 'Не працює проєктор в аудиторії 305'
   */
  @Transform(trim)
  @IsString()
  @Length(1, 80, { message: 'назва – від 1 до 80 символів' })
  title: string;

  /**
   * Докладний опис проблеми (до 500 символів)
   * @example 'При підключенні через кабель HDMI зображення відсутнє.'
   */
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    enum: PRIORITIES,
    enumName: 'Priority',
    description:
      'Пріоритет заявки (critical доступний лише викладачу та адміністратору)',
    example: 'medium',
  })
  @IsIn(PRIORITIES, { message: `пріоритет – одне з: ${PRIORITIES.join(', ')}` })
  priority: Priority;

  /**
   * Мітки (теги) для категоризації заявки (до 10 елементів)
   * @example ['проєктор', 'ауд-305']
   */
  @IsOptional()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  tags?: string[];
}
