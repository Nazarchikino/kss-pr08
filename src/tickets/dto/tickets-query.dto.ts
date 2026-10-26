import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { PageQueryDto } from '../../common/page-query.dto.js';
import {
  PRIORITIES,
  TICKET_STATUSES,
  type Priority,
  type TicketStatus,
} from '../ticket.model.js';

export const TICKET_SORTS = [
  'createdAt',
  '-createdAt',
  'priority',
  '-priority',
] as const;
export type TicketSort = (typeof TICKET_SORTS)[number];

/** Параметри фільтрації, пошуку, сортування та пагінації списку заявок. */
export class TicketsQueryDto extends PageQueryDto {
  @ApiPropertyOptional({
    enum: TICKET_STATUSES,
    enumName: 'TicketStatus',
    description: 'Фільтр за станом заявки',
    example: 'open',
  })
  @IsOptional()
  @IsIn(TICKET_STATUSES)
  status?: TicketStatus;

  @ApiPropertyOptional({
    enum: PRIORITIES,
    enumName: 'Priority',
    description: 'Фільтр за пріоритетом заявки',
    example: 'high',
  })
  @IsOptional()
  @IsIn(PRIORITIES)
  priority?: Priority;

  /**
   * Фільтр за ідентифікатором автора заявки
   * @example 1
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  authorId?: number;

  /**
   * Фільтр за ідентифікатором призначеного виконавця
   * @example 3
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  assigneeId?: number;

  /**
   * Пошуковий рядок у назві та описі заявки
   * @example 'HDMI'
   */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;

  @ApiPropertyOptional({
    enum: TICKET_SORTS,
    default: '-createdAt',
    description: 'Сортування (префікс `-` означає спадання)',
    example: '-createdAt',
  })
  @IsOptional()
  @IsIn(TICKET_SORTS)
  sort?: TicketSort = '-createdAt';
}
