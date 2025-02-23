import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFcfa',
  standalone: true
})
export class CurrencyFcfaPipe implements PipeTransform {
  transform(value: number | string): string {
    if (value === null || value === undefined) {
      return '';
    }

    // Convert string to number if necessary
    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    // Format the number with thousand separators
    const formattedValue = numValue.toLocaleString('fr-FR');

    return `${formattedValue} FCFA`;
  }
}
