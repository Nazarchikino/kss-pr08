import { applyDecorators, type Type } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ProblemDetailsEntity } from '../http/problem-details.entity.js';

const PROBLEM_DESCRIPTIONS: Record<number, string> = {
  400: 'Некоректний запит',
  401: 'Потрібна автентифікація',
  403: 'Доступ заборонено',
  404: 'Ресурс не знайдено',
  409: 'Конфлікт стану',
  422: 'Помилка валідації',
  500: 'Внутрішня помилка сервера',
};

/** Додає відповіді-помилки з медіатипом application/problem+json (RFC 9457). */
export function ApiProblemResponses(...codes: number[]) {
  return applyDecorators(
    ApiExtraModels(ProblemDetailsEntity),
    ...codes.map((status) =>
      ApiResponse({
        status,
        description: PROBLEM_DESCRIPTIONS[status] ?? 'Помилка',
        content: {
          'application/problem+json': {
            schema: { $ref: getSchemaPath(ProblemDetailsEntity) },
          },
        },
      }),
    ),
  );
}

/** Описує відповідь 200 OK зі сторінкою колекції { items, page, pageSize, total }. */
export function ApiPageResponse<TModel extends Type<unknown>>(
  model: TModel,
  description: string,
) {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      description,
      schema: {
        type: 'object',
        required: ['items', 'page', 'pageSize', 'total'],
        properties: {
          items: {
            type: 'array',
            items: { $ref: getSchemaPath(model) },
            description: 'Елементи поточної сторінки',
          },
          page: {
            type: 'integer',
            minimum: 1,
            example: 1,
            description: 'Номер поточної сторінки (починаючи з 1)',
          },
          pageSize: {
            type: 'integer',
            minimum: 1,
            maximum: 50,
            example: 10,
            description: 'Кількість елементів на сторінці',
          },
          total: {
            type: 'integer',
            minimum: 0,
            example: 6,
            description: 'Загальна кількість елементів у колекції',
          },
        },
      },
    }),
  );
}

/** Описує відповідь 201 Created із заголовком Location та схемою створеного ресурсу. */
export function ApiCreatedWithLocation<TModel extends Type<unknown>>(
  model: TModel,
  description: string,
) {
  return applyDecorators(
    ApiExtraModels(model),
    ApiCreatedResponse({
      description,
      type: model,
      headers: {
        Location: {
          description: 'Адреса створеного ресурсу',
          schema: {
            type: 'string',
            format: 'uri-reference',
            example: '/api/v1/tickets/7',
          },
        },
      },
    }),
  );
}
