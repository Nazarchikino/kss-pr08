// Наскрізні тести практичної роботи № 8: документація Swagger (OpenAPI). Файл не змінюйте.
// Плагін компілятора @nestjs/swagger працює лише під час `nest build`, тому схеми DTO
// перевіряє команда `npm run check:api`, а тут – структура специфікації з явних декораторів.
import { type INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createApp } from './helpers.js';

describe('helpdesk-api (e2e): документація OpenAPI', () => {
  let app: INestApplication;
  let doc: Record<string, any>;

  beforeAll(async () => {
    app = await createApp();
    doc = (await request(app.getHttpServer()).get('/api/docs-json').expect(200))
      .body;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/docs – сторінка Swagger UI', async () => {
    const res = await request(app.getHttpServer()).get('/api/docs').expect(200);
    expect(res.text).toContain('swagger');
  });

  it('метадані: версія з package.json, сервер з /api/v1, схема bearer', () => {
    expect(doc.openapi).toMatch(/^3\./);
    expect(doc.info.version).toBe('1.0.0');
    expect(doc.servers[0].url).toMatch(/\/api\/v1$/);
    expect(doc.components.securitySchemes.bearer).toMatchObject({
      type: 'http',
      scheme: 'bearer',
    });
    expect(doc.security).toEqual([{ bearer: [] }]);
  });

  it('шляхи без префікса /api/v1; службовий /health не документується', () => {
    expect(Object.keys(doc.paths)).toEqual(
      expect.arrayContaining([
        '/auth/login',
        '/tickets',
        '/tickets/{ticketId}',
        '/tickets/{ticketId}/status',
        '/tickets/{ticketId}/comments',
        '/users',
        '/users/me',
        '/users/{userId}',
      ]),
    );
    expect(
      Object.keys(doc.paths).some(
        (p) => p.includes('health') || p.startsWith('/api'),
      ),
    ).toBe(false);
  });

  it('operationId – унікальні назви операцій (як у проєкті API ПР4)', () => {
    const ids = Object.values(doc.paths).flatMap((item: any) =>
      Object.values(item).map((op: any) => op.operationId),
    );
    expect(ids).toEqual(
      expect.arrayContaining([
        'listTickets',
        'getTicket',
        'createTicket',
        'updateTicket',
        'changeTicketStatus',
        'deleteTicket',
        'login',
      ]),
    );
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('кожна операція має summary і теги', () => {
    for (const item of Object.values(doc.paths) as any[]) {
      for (const op of Object.values(item) as any[]) {
        expect(op.summary, op.operationId).toBeTruthy();
        expect(op.tags?.length, op.operationId).toBeGreaterThan(0);
      }
    }
  });

  it('POST /tickets: 201 із заголовком Location; помилки – application/problem+json', () => {
    const post = doc.paths['/tickets'].post;
    expect(post.responses['201'].headers.Location).toBeDefined();
    expect(Object.keys(post.responses['422'].content)).toEqual([
      'application/problem+json',
    ]);
    expect(post.responses['401']).toBeDefined();
  });

  it('дія зміни стану позначена x-kss-action; вхід не вимагає токена', () => {
    expect(doc.paths['/tickets/{ticketId}/status'].post['x-kss-action']).toBe(
      true,
    );
    expect(doc.paths['/auth/login'].post.security).toEqual([]);
  });

  it('список заявок описано як сторінку { items, page, pageSize, total }', () => {
    const schema =
      doc.paths['/tickets'].get.responses['200'].content['application/json']
        .schema;
    expect(schema.properties.items.type).toBe('array');
    expect(schema.required).toEqual(['items', 'page', 'pageSize', 'total']);
  });
});
