// src/app/shared/utils/validators.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static positiveNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') return null;
      return value > 0 ? null : { positiveNumber: true };
    };
  }

  static discountPrice(basePriceControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) return null;

      const basePrice = control.parent.get(basePriceControlName)?.value;
      const discountPrice = control.value;

      if (!discountPrice || discountPrice === 0) return null;
      if (!basePrice || basePrice === 0) return { basePriceRequired: true };

      return discountPrice < basePrice ? null : { discountPriceTooHigh: true };
    };
  }

  static dateRange(startDateControlName: string, endDateControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) return null;

      const startDate = control.parent.get(startDateControlName)?.value;
      const endDate = control.parent.get(endDateControlName)?.value;

      if (!startDate || !endDate) return null;

      return new Date(startDate) < new Date(endDate) ? null : { dateRangeInvalid: true };
    };
  }

  static requiredIf(condition: () => boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!condition()) return null;
      return control.value ? null : { requiredIf: true };
    };
  }

  static minArrayLength(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!Array.isArray(control.value)) return null;
      return control.value.length >= min ? null : { minArrayLength: { min, actual: control.value.length } };
    };
  }
}
