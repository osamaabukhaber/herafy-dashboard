// src/app/shared/pipes/discount.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'discountPercentage',
  standalone: true
})
export class DiscountPercentagePipe implements PipeTransform {
  transform(basePrice: number, discountPrice: number): number {
    if (!basePrice || !discountPrice || discountPrice >= basePrice) return 0;
    return Math.round(((basePrice - discountPrice) / basePrice) * 100);
  }
}



// src/app/shared/pipes/date.pipe.ts
// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//   name: 'customDate',
//   standalone: true
// })
// export class CustomDatePipe implements PipeTransform {
//   transform(value: Date | string, format: 'short' | 'medium' | 'long' | 'full' = 'medium'): string {
//     if (!value) return '';

//     const date = typeof value === 'string' ? new Date(value) : value;

//     const options: Intl.DateTimeFormatOptions = {
//       short: { day: '2-digit', month: '2-digit', year: 'numeric' },
//       medium: { day: '2-digit', month: 'short', year: 'numeric' },
//       long: { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' },
//       full: { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }
//     };

//     return new Intl.DateTimeFormat('ar-SA', options[format]).format(date);
//   }
// }
