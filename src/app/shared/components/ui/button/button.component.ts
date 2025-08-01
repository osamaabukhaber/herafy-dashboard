import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="buttonClasses"
      (click)="onClick.emit($event)"
    >
      @if (loading) {
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      }
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Output() onClick = new EventEmitter<Event>();

  get buttonClasses(): string {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
      danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
      success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
      outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-blue-500'
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };

    const widthClass = this.fullWidth ? 'w-full' : '';

    return `${baseClasses} ${variantClasses[this.variant]} ${sizeClasses[this.size]} ${widthClass}`;
  }
}



//*!

// import { Component, Input } from '@angular/core';
// import { CommonModule } from '@angular/common';

// type ButtonVariant = 'primary' | 'secondary' | 'danger';

// @Component({
//   selector: 'app-button',
//   standalone: true,
//   imports: [CommonModule],
//   template: `
//     <button [type]="type" [ngClass]="buttonClasses" [disabled]="disabled">
//       <ng-content></ng-content>
//     </button>
//   `,
// })
// export class ButtonComponent {
//   @Input() variant: ButtonVariant = 'primary';
//   @Input() type: 'button' | 'submit' | 'reset' = 'button';
//   @Input() disabled: boolean = false; // Fixed typo: @Input-() -> @Input()

//   readonly baseClasses = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

//   readonly variantClasses: Record<ButtonVariant, string> = {
//     primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
//     secondary: 'bg-zinc-200 text-zinc-800 hover:bg-zinc-300 focus:ring-zinc-400 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600',
//     danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
//   };

//   get buttonClasses(): string {
//     return `${this.baseClasses} ${this.variantClasses[this.variant]}`;
//   }
// }


//*!

// import { Component, Input } from '@angular/core';
// import { CommonModule } from '@angular/common';

// type ButtonVariant = 'primary' | 'secondary' | 'danger';

// @Component({
//   selector: 'app-button',
//   standalone: true,
//   imports: [CommonModule],
//   template: `
//     <button [type]="type" [ngClass]="buttonClasses" [disabled]="disabled">
//       <ng-content></ng-content>
//     </button>
//   `,
// })
// export class ButtonComponent {
//   @Input() variant: ButtonVariant = 'primary';
//   @Input() type: 'button' | 'submit' | 'reset' = 'button';
//   @Input-() disabled: boolean = false;

//   baseClasses = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

//   variantClasses: Record<ButtonVariant, string> = {
//     primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
//     secondary: 'bg-zinc-200 text-zinc-800 hover:bg-zinc-300 focus:ring-zinc-400 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600',
//     danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
//   };

//   get buttonClasses(): string {
//     return `${this.baseClasses} ${this.variantClasses[this.variant]}`;
//   }
// }
