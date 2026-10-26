import { writeFileSync } from 'node:fs';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { configureApp } from './app.setup.js';
import { buildOpenApiDocument } from './swagger.js';

/** Записує специфікацію у файл openapi.json без запуску HTTP-сервера. Запуск: npm run openapi */
const app = configureApp(
  await NestFactory.create(AppModule, { logger: false }),
);
await app.init();
writeFileSync(
  'openapi.json',
  JSON.stringify(buildOpenApiDocument(app), null, 2) + '\n',
);
await app.close();
console.log('Специфікацію записано у файл openapi.json');
