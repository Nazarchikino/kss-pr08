import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

/** Параметри пагінації – базовий клас для DTO запитів до колекцій. */
export class PageQueryDto {
  /**
   * Номер сторінки (починаючи з 1)
   * @example 1
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  /**
   * Кількість елементів на сторінці (від 1 до 50)
   * @example 10
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  pageSize?: number = 10;
}
