// / src/app/shared/pipes/text-truncate.pipe.ts


import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textTruncate',
  standalone: true
})
export class TextTruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 100, suffix: string = '...'): string {
    if (!value) return '';
    if (value.length <= limit) return value;
    return value.substring(0, limit) + suffix;
  }
}
