// src/app/shared/pipes/stock-status.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stockStatus',
  standalone: true
})
export class StockStatusPipe implements PipeTransform {
  transform(stock: number): { status: string; class: string } {
    if (stock === 0) {
      return { status: 'Out of Stock', class: 'text-red-600 bg-red-100' };
    } else if (stock <= 5) {
      return { status: 'Low Stock', class: 'text-yellow-600 bg-yellow-100' };
    } else {
      return { status: 'In Stock', class: 'text-green-600 bg-green-100' };
    }
  }
}
