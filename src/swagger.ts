import type { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  type OpenAPIObject,
  SwaggerModule,
} from '@nestjs/swagger';
import { appInfoFactory } from './app-info.js';

export function buildOpenApiDocument(app: INestApplication): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle('Helpdesk API – служба технічної підтримки коледжу')
    .setDescription(
      'REST API серверної частини служби технічної підтримки коледжу (навчальний проєкт курсу «Розробка клієнт-серверних застосувань»)',
    )
    .setVersion(appInfoFactory().version)
    .addServer('http://localhost:3000/api/v1', 'Локальний сервер розробки')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      description: 'Токен з POST /auth/login',
    })
    .addSecurityRequirements('bearer')
    .addTag('auth', 'Автентифікація')
    .addTag('tickets', 'Заявки та їх життєвий цикл')
    .addTag('comments', 'Коментарі до заявок')
    .addTag('users', 'Користувачі системи')
    .build();
  return SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: true, // префікс уже в адресі сервера
    operationIdFactory: (_controllerKey: string, methodKey: string) =>
      methodKey,
  });
}

export function setupSwagger(app: INestApplication): void {
  SwaggerModule.setup('api/docs', app, () => buildOpenApiDocument(app), {
    jsonDocumentUrl: 'api/docs-json',
    swaggerOptions: { persistAuthorization: true },
  });
}
