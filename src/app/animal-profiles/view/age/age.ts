import { Pipe, PipeTransform } from '@angular/core';

const oneDay = 1000 * 60 * 60 * 24;
const oneMonth = oneDay * 30;
const oneYear = oneDay * 365;

@Pipe({
  name: 'age',
  pure: true,
})
export class Age implements PipeTransform {
  public transform(value: Date | undefined): string {
    if (!value) {
      return 'N/A';
    }

    const diff = Date.now() - value.getTime();

    // If less than 13 months old, show months
    if (diff < oneYear + oneMonth) {
      return this.#singleOrPlural(Math.floor(diff / oneMonth), 'month', 'months');
    }

    // If less than 2 years old, show years and months
    if (diff < oneYear * 2) {
      return `1 year, ${this.#singleOrPlural(
        Math.floor((diff % oneYear) / oneMonth),
        'month',
        'months',
      )}`;
    }

    // If older than 2 years, show years
    return Math.floor(diff / oneYear) + ' years';
  }

  readonly #singleOrPlural = (value: number, singular: string, plural: string): string =>
    `${value} ${value === 1 ? singular : plural}`;
}
