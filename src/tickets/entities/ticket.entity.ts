import { ApiProperty } from '@nestjs/swagger';
import {
  PRIORITIES,
  TICKET_STATUSES,
  type Priority,
  type Ticket,
  type TicketStatus,
} from '../ticket.model.js';

/** Заявка до служби технічної підтримки (схема для документації). */
export class TicketEntity implements Ticket {
  /**
   * Ідентифікатор заявки
   * @example 1
   */
  readonly id: number;

  /**
   * Короткий заголовок проблеми
   * @example 'Не працює проєктор в аудиторії 305'
   */
  title: string;

  /**
   * Докладний опис проблеми
   * @example 'При підключенні ноутбука через HDMI зображення не виводиться.'
   */
  description?: string;

  @ApiProperty({
    enum: TICKET_STATUSES,
    enumName: 'TicketStatus',
    description: 'Поточний стан заявки',
    example: 'open',
  })
  status: TicketStatus;

  @ApiProperty({
    enum: PRIORITIES,
    enumName: 'Priority',
    description: 'Пріоритет виконання заявки',
    example: 'medium',
  })
  priority: Priority;

  /**
   * Ідентифікатор автора заявки
   * @example 1
   */
  authorId: number;

  @ApiProperty({
    type: 'integer',
    nullable: true,
    description: 'Виконавець; null – не призначено',
    example: 3,
  })
  assigneeId: number | null;

  /**
   * Час створення заявки у форматі ISO 8601 (UTC)
   * @example '2026-10-01T08:30:00.000Z'
   */
  createdAt: string;

  /**
   * Час останнього оновлення заявки у форматі ISO 8601 (UTC)
   * @example '2026-10-01T09:15:00.000Z'
   */
  updatedAt: string;

  /**
   * Мітки (теги) заявки
   * @example ['проєктор', 'ауд-305']
   */
  tags: string[];
}
