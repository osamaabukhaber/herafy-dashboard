import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrency',
  standalone: true,
})
export class CustomCurrencyPipe implements PipeTransform {
  transform(value: number | undefined | null, currencyCode: string = 'EGP', symbolDisplay: 'symbol' | 'code' = 'symbol'): string {
    if (value == null) {
      return '';
    }
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: symbolDisplay,
    }).format(value);
  }
}
