/** Опис помилки HTTP API за стандартом RFC 9457 (application/problem+json). */
export class ProblemDetailsEntity {
  /**
   * URI типу проблеми (about:blank – помилка визначається кодом стану HTTP)
   * @example 'about:blank'
   */
  type: string = 'about:blank';

  /**
   * Коротка людиночитана назва класу помилки
   * @example 'Ресурс не знайдено'
   */
  title: string;

  /**
   * HTTP-код стану відповіді
   * @example 404
   */
  status: number;

  /**
   * Докладне пояснення конкретного випадку помилки
   * @example 'Заявку з id=999 не знайдено'
   */
  detail?: string;

  /**
   * Шлях запиту, під час обробки якого виникла помилка
   * @example '/api/v1/tickets/999'
   */
  instance: string;

  /**
   * Унікальний ідентифікатор запиту (X-Request-Id) для кореляції з журналом сервера
   * @example '8f14e45f-ceea-467a-9538-1b6a97b1e320'
   */
  requestId?: string;
}
