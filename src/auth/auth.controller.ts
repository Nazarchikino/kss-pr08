import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiExtension,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiProblemResponses } from '../common/api/api-docs.decorators.js';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { TokenEntity } from './entities/token.entity.js';
import { Public } from './public.decorator.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Вхід у систему', security: [] })
  @ApiExtension('x-kss-action', true)
  @ApiOkResponse({ description: 'Токен доступу', type: TokenEntity })
  @ApiProblemResponses(401, 422)
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }
}
