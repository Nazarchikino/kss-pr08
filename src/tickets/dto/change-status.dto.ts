import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { TICKET_STATUSES, type TicketStatus } from '../ticket.model.js';

/** Цільовий стан заявки для переходу за графом життєвого циклу. */
export class ChangeStatusDto {
  @ApiProperty({
    enum: TICKET_STATUSES,
    enumName: 'TicketStatus',
    description: 'Новий стан заявки (open → in_progress → resolved → closed)',
    example: 'in_progress',
  })
  @IsIn(TICKET_STATUSES)
  status: TicketStatus;
}
