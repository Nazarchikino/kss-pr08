import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

/** Дані для додавання коментаря до заявки. */
export class CreateCommentDto {
  /**
   * Текст коментаря (від 1 до 1000 символів)
   * @example 'Перевірили кабель HDMI — потрібна заміна.'
   */
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @Length(1, 1000)
  text: string;
}
