import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { Roles } from '../auth/roles.decorator.js';
import {
  ApiPageResponse,
  ApiProblemResponses,
} from '../common/api/api-docs.decorators.js';
import { ParsePositiveIntPipe } from '../common/http/parse-positive-int.pipe.js';
import { PageQueryDto } from '../common/page-query.dto.js';
import { paginate } from '../common/page.js';
import { UserEntity } from './entities/user.entity.js';
import type { User } from './user.model.js';
import { UsersService } from './users.service.js';

@ApiTags('users')
@ApiBearerAuth()
@ApiProblemResponses(401)
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Roles('admin')
  @Get()
  @ApiOperation({ summary: 'Список користувачів (лише для адміністратора)' })
  @ApiPageResponse(UserEntity, 'Сторінка списку користувачів')
  @ApiProblemResponses(403, 422)
  listUsers(@Query() page: PageQueryDto) {
    return paginate(this.users.findAll(), page.page, page.pageSize);
  }

  /** Статичний маршрут оголошено ДО параметризованого :userId. */
  @Get('me')
  @ApiOperation({ summary: 'Поточний авторизований користувач' })
  @ApiOkResponse({
    description: 'Профіль поточного користувача',
    type: UserEntity,
  })
  getCurrentUser(@CurrentUser() user: User) {
    return user;
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Отримати користувача за ідентифікатором' })
  @ApiOkResponse({ description: 'Профіль користувача', type: UserEntity })
  @ApiProblemResponses(400, 404)
  getUser(@Param('userId', ParsePositiveIntPipe) userId: number) {
    return this.users.findOne(userId);
  }
}
