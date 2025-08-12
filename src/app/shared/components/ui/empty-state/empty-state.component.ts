
// src/app/components/ui/empty-state/empty-state.component.ts
import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="text-center py-12">
      <div class="text-4xl mb-4">{{ icon() }}</div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">{{ title() }}</h3>
      @if (description()) {
        <p class="text-gray-600 mb-6 max-w-sm mx-auto">{{ description() }}</p>
      }
      @if (actionText()) {
        <button
          (click)="actionClick.emit()"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          {{ actionText() }}
        </button>
      }
    </div>
  `
})
export class EmptyStateComponent {
  readonly title = input.required<string>();
  readonly description = input<string>();
  readonly icon = input<string>('📄');
  readonly actionText = input<string>();
  readonly actionClick = output<void>();
}
