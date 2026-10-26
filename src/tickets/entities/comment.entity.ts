import type { Comment } from '../comment.model.js';

/** Коментар до заявки служби технічної підтримки (схема для документації). */
export class CommentEntity implements Comment {
  /**
   * Ідентифікатор коментаря
   * @example 1
   */
  readonly id: number;

  /**
   * Ідентифікатор заявки, до якої належить коментар
   * @example 1
   */
  ticketId: number;

  /**
   * Ідентифікатор автора коментаря
   * @example 3
   */
  authorId: number;

  /**
   * Текст коментаря
   * @example 'Замінили кабель HDMI, проєктор працює.'
   */
  text: string;

  /**
   * Час додавання коментаря у форматі ISO 8601 (UTC)
   * @example '2026-10-01T10:00:00.000Z'
   */
  createdAt: string;
}
