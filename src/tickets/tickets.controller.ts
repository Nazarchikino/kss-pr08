import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtension,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { Roles } from '../auth/roles.decorator.js';
import {
  ApiCreatedWithLocation,
  ApiPageResponse,
  ApiProblemResponses,
} from '../common/api/api-docs.decorators.js';
import { ParsePositiveIntPipe } from '../common/http/parse-positive-int.pipe.js';
import { PageQueryDto } from '../common/page-query.dto.js';
import type { User } from '../users/user.model.js';
import { ChangeStatusDto } from './dto/change-status.dto.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { TicketsQueryDto } from './dto/tickets-query.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';
import { CommentEntity } from './entities/comment.entity.js';
import { TicketEntity } from './entities/ticket.entity.js';
import { TicketsService } from './tickets.service.js';

@ApiTags('tickets')
@ApiBearerAuth()
@ApiProblemResponses(401)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly tickets: TicketsService) {}

  @Get()
  @ApiOperation({
    summary: 'Список заявок із фільтрацією, сортуванням і пагінацією',
  })
  @ApiPageResponse(TicketEntity, 'Сторінка списку заявок')
  @ApiProblemResponses(422)
  listTickets(@Query() query: TicketsQueryDto) {
    return this.tickets.findAll(query);
  }

  @Get(':ticketId')
  @ApiOperation({ summary: 'Отримати заявку' })
  @ApiOkResponse({ description: 'Заявка', type: TicketEntity })
  @ApiProblemResponses(400, 404)
  getTicket(@Param('ticketId', ParsePositiveIntPipe) ticketId: number) {
    return this.tickets.findOne(ticketId);
  }

  @Post()
  @ApiOperation({ summary: 'Створити заявку' })
  @ApiCreatedWithLocation(TicketEntity, 'Заявку створено')
  @ApiProblemResponses(403, 422)
  async createTicket(
    @Body() dto: CreateTicketDto,
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    const ticket = await this.tickets.create(dto, user);
    res.location(`/api/v1/tickets/${ticket.id}`);
    return ticket;
  }

  @Patch(':ticketId')
  @ApiOperation({ summary: 'Частково оновити заявку' })
  @ApiOkResponse({ description: 'Оновлена заявка', type: TicketEntity })
  @ApiProblemResponses(400, 403, 404, 422)
  updateTicket(
    @Param('ticketId', ParsePositiveIntPipe) ticketId: number,
    @Body() dto: UpdateTicketDto,
    @CurrentUser() user: User,
  ) {
    return this.tickets.update(ticketId, dto, user);
  }

  @Roles('teacher', 'admin')
  @Post(':ticketId/status')
  @HttpCode(200)
  @ApiOperation({ summary: 'Змінити стан заявки' })
  @ApiExtension('x-kss-action', true)
  @ApiOkResponse({
    description: 'Заявка з оновленим станом',
    type: TicketEntity,
  })
  @ApiProblemResponses(400, 403, 404, 409, 422)
  changeTicketStatus(
    @Param('ticketId', ParsePositiveIntPipe) ticketId: number,
    @Body() dto: ChangeStatusDto,
  ) {
    return this.tickets.changeStatus(ticketId, dto.status);
  }

  @Roles('admin')
  @Delete(':ticketId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Видалити заявку' })
  @ApiNoContentResponse({ description: 'Заявку видалено' })
  @ApiProblemResponses(400, 403, 404)
  deleteTicket(@Param('ticketId', ParsePositiveIntPipe) ticketId: number) {
    return this.tickets.remove(ticketId);
  }

  @ApiTags('comments')
  @Get(':ticketId/comments')
  @ApiOperation({ summary: 'Список коментарів до заявки' })
  @ApiPageResponse(CommentEntity, 'Сторінка коментарів до заявки')
  @ApiProblemResponses(400, 404, 422)
  listTicketComments(
    @Param('ticketId', ParsePositiveIntPipe) ticketId: number,
    @Query() page: PageQueryDto,
  ) {
    return this.tickets.findComments(ticketId, page);
  }

  @ApiTags('comments')
  @Get(':ticketId/comments/:commentId')
  @ApiOperation({ summary: 'Отримати коментар до заявки' })
  @ApiOkResponse({ description: 'Коментар до заявки', type: CommentEntity })
  @ApiProblemResponses(400, 404)
  getTicketComment(
    @Param('ticketId', ParsePositiveIntPipe) ticketId: number,
    @Param('commentId', ParsePositiveIntPipe) commentId: number,
  ) {
    return this.tickets.findComment(ticketId, commentId);
  }

  @ApiTags('comments')
  @Post(':ticketId/comments')
  @ApiOperation({ summary: 'Додати коментар до заявки' })
  @ApiCreatedWithLocation(CommentEntity, 'Коментар додано')
  @ApiProblemResponses(400, 404, 422)
  async createTicketComment(
    @Param('ticketId', ParsePositiveIntPipe) ticketId: number,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    const comment = await this.tickets.addComment(ticketId, dto, user);
    res.location(`/api/v1/tickets/${ticketId}/comments/${comment.id}`);
    return comment;
  }
}
