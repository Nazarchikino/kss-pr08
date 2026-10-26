import type { components, operations, paths } from './api.js';

/** Тип операції отримання списку заявок із згенерованої специфікації OpenAPI. */
export type ListTicketsOperation = paths['/tickets']['get'];

/** Параметри запиту (query) для фільтрації, сортування та пагінації заявок. */
export type ListTicketsQuery = NonNullable<
  operations['listTickets']['parameters']['query']
>;

/** Успішна відповідь (200 OK) – сторінка заявок { items, page, pageSize, total }. */
export type TicketsPageResponse =
  ListTicketsOperation['responses'][200]['content']['application/json'];

/** Схема однієї заявки та опис помилки RFC 9457 зі скомпільованих компонентів. */
export type TicketDto = components['schemas']['TicketEntity'];
export type ProblemDetailsDto = components['schemas']['ProblemDetailsEntity'];

export interface HelpdeskClientOptions {
  /** Базова адреса сервера API (за замовчуванням http://localhost:3000/api/v1). */
  baseUrl?: string;
  /** Токен доступу з POST /auth/login. */
  accessToken: string;
  /** Користувацька функція fetch (для тестування або SSR). */
  fetchFn?: typeof fetch;
}

/** Помилка виклику Helpdesk API з розібраним тілом application/problem+json. */
export class HelpdeskApiError extends Error {
  constructor(
    public readonly problem: ProblemDetailsDto,
    public readonly status: number,
  ) {
    super(problem.detail ?? problem.title);
    this.name = 'HelpdeskApiError';
  }
}

/**
 * Отримує сторінку списку заявок (`GET /tickets`) із повною статичною типізацією
 * вхідних параметрів фільтрації/пагінації та вихідної відповіді за `client/api.d.ts`.
 */
export async function fetchTicketsPage(
  options: HelpdeskClientOptions,
  query: ListTicketsQuery = {},
): Promise<TicketsPageResponse> {
  const baseUrl = (options.baseUrl ?? 'http://localhost:3000/api/v1').replace(
    /\/$/,
    '',
  );
  const url = new URL(`${baseUrl}/tickets`);

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  const fetchImpl = options.fetchFn ?? fetch;
  const response = await fetchImpl(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json, application/problem+json',
      Authorization: `Bearer ${options.accessToken}`,
    },
  });

  if (!response.ok) {
    const problem = (await response.json()) as ProblemDetailsDto;
    throw new HelpdeskApiError(problem, response.status);
  }

  return (await response.json()) as TicketsPageResponse;
}
