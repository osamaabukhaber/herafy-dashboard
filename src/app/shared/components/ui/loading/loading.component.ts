// src/app/shared/components/ui/loading/loading.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClasses">
      @if (type === 'spinner') {
        <svg class="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      } @else if (type === 'skeleton') {
        <div class="animate-pulse space-y-4">
          @for (item of skeletonItems; track $index) {
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          }
        </div>
      } @else {
        <div class="flex space-x-1">
          @for (dot of dots; track $index) {
            <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce" [style.animation-delay]="dot + 'ms'"></div>
          }
        </div>
      }
      @if (message) {
        <p class="mt-2 text-sm text-gray-600">{{ message }}</p>
      }
    </div>
  `
})
export class LoadingComponent {
  @Input() type: 'spinner' | 'dots' | 'skeleton' = 'spinner';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() message = '';
  @Input() centered = true;

  dots = [0, 100, 200];
  skeletonItems = Array(3).fill(0);

  get containerClasses(): string {
    const baseClasses = 'flex flex-col items-center';
    const centerClass = this.centered ? 'justify-center min-h-32' : '';
    return `${baseClasses} ${centerClass}`;
  }
}

//*!
// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-loading-spinner',
//   standalone: true,
//   template: `
//     <div class="flex justify-center items-center p-8">
//       <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//     </div>
//   `,
// })
// export class LoadingSpinnerComponent {}
