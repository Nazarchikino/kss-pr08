import { ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger';
import { IsInt, IsOptional, Min, ValidateIf } from 'class-validator';
import { CreateTicketDto } from './create-ticket.dto.js';

/**
 * Часткове оновлення: усі поля необов’язкові. Автор і стан не змінюються через PATCH
 * (стан – окремою дією POST /tickets/{ticketId}/status).
 */
export class UpdateTicketDto extends PartialType(
  PickType(CreateTicketDto, [
    'title',
    'description',
    'priority',
    'tags',
  ] as const),
) {
  /** null – зняти виконавця. */
  @ApiPropertyOptional({
    type: 'integer',
    nullable: true,
    minimum: 1,
    description: 'Ідентифікатор виконавця; null – зняти виконавця',
    example: 3,
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsInt()
  @Min(1)
  assigneeId?: number | null;
}
