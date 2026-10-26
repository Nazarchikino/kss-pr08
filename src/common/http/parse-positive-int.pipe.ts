import {
  BadRequestException,
  Injectable,
  type ArgumentMetadata,
  type PipeTransform,
} from '@nestjs/common';

/** Власний pipe: параметр шляху – ціле додатне число (1, 2, …), інакше 400. */
@Injectable()
export class ParsePositiveIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const n = Number(value);
    if (!/^\d+$/.test(value) || !Number.isSafeInteger(n) || n < 1) {
      throw new BadRequestException(
        `Параметр ${metadata.data ?? ''} має бути цілим додатним числом, отримано «${value}»`,
      );
    }
    return n;
  }
}
