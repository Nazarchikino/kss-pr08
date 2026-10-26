# Вимоги практичної роботи № 8 «Документування REST API засобами Swagger (OpenAPI)»

Продовження проєкту практичної роботи № 7. Підхід code-first: специфікація OpenAPI будується з коду.
Перевірка:

- `npm run check` – 5 модульних і 51 e2e-тест (новий файл `test/docs.e2e-spec.ts`; у `test/app.e2e-spec.ts` список користувачів – сторінка);
- `npm run check:api` – збирання, експорт `openapi.json` і перевірка правилами стилю API з практичної № 4 (`api-lint/`): **0 помилок**.

Залежність: `npm install @nestjs/swagger`.

## Налаштування

| Що | Де | Вимоги |
|---|---|---|
| Плагін компілятора | `nest-cli.json` → `compilerOptions.plugins` | `@nestjs/swagger` з `introspectComments: true`, `classValidatorShim: true`; обробляє файли `*.dto.ts` і `*.entity.ts` |
| Документ | `src/swagger.ts` → `buildOpenApiDocument(app)` | DocumentBuilder: назва, опис, версія з package.json, сервер `http://localhost:3000/api/v1`, схема `bearer` і глобальна вимога безпеки, теги auth / tickets / comments / users; `ignoreGlobalPrefix: true`; `operationIdFactory` – назва методу контролера |
| Swagger UI | `setupSwagger(app)` у `configureApp` | `/api/docs`, JSON – `/api/docs-json` |
| Експорт | `src/openapi.export.ts` | записує `openapi.json` без запуску HTTP-сервера |

## Документування

- Моделі відповідей – класи `*.entity.ts`: `TicketEntity`, `CommentEntity`, `UserEntity`, `TokenEntity`, `ProblemDetailsEntity`
  (властивості описуються JSDoc-коментарями; перелічення – `@ApiProperty({ enum, enumName })`).
- `PageQueryDto` перенести у файл `src/common/page-query.dto.ts` (інакше плагін не побачить page і pageSize); поля page, pageSize, sort – необов’язкові (`?`) зі значеннями за замовчуванням.
- Власні складені декоратори (`src/common/api/api-docs.decorators.ts`, `applyDecorators`):
  `ApiProblemResponses(...codes)` – відповіді `application/problem+json`; `ApiPageResponse(Model, опис)` – сторінка `{ items, page, pageSize, total }`; `ApiCreatedWithLocation(Model, опис)` – 201 із заголовком Location.
- Кожна операція: `@ApiOperation({ summary })`, теги, відповіді успіху й помилок; захищені контролери – `@ApiBearerAuth()` і 401.
- Методи контролерів перейменувати на operationId з проєкту ПР4: listTickets, getTicket, createTicket, updateTicket, changeTicketStatus, deleteTicket, listTicketComments, getTicketComment, createTicketComment, listUsers, getCurrentUser, getUser, login.
- Дія зміни стану – `@ApiExtension('x-kss-action', true)`; вхід – `security: []` і x-kss-action.
- `HealthController` – `@ApiExcludeController()` (службовий маршрут).
- `GET /users` повертає сторінку (виявлено лінтером: колекція без пагінації).
