import { Controller, Get, Param } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { Roles } from '../auth/roles.decorator.js';
import { ParsePositiveIntPipe } from '../common/http/parse-positive-int.pipe.js';
import type { User } from './user.model.js';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Roles('admin')
  @Get()
  findAll() {
    return this.users.findAll();
  }

  /** Статичний маршрут оголошено ДО параметризованого :userId. */
  @Get('me')
  me(@CurrentUser() user: User) {
    return user;
  }

  @Get(':userId')
  findOne(@Param('userId', ParsePositiveIntPipe) userId: number) {
    return this.users.findOne(userId);
  }
}
