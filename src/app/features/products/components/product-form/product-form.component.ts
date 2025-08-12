import {
  Component,
  OnInit,
  inject,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ProductApiService } from '../../services/product-api.service';
import { Category } from '../../../../shared/models/category.interface';
import { Product } from '../../../../shared/models/product.interface';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private productApi = inject(ProductApiService);
  private cdr = inject(ChangeDetectorRef);

  productForm!: FormGroup;
  stores: { _id: string; name: string }[] = [];
  categories: Category[] = [];
  loading = false;
  submitting = false;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  imageUrls: string[] = [];

  ngOnInit(): void {
    this.initForm();
    this.loadDropdownData();
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      basePrice: [0, [Validators.required, Validators.min(0.01)]],
      discountPrice: [null, [Validators.min(0)]],
      category: ['', Validators.required],
      store: ['', Validators.required],
      variants: this.fb.array([]),
      images: [],
      isActive: [true],
      inStock: [true],
    });
  }

  addVariant(): void {
    const variantForm = this.fb.group({
      name: ['', Validators.required],
      options: this.fb.array([
        this.fb.group({
          value: ['', Validators.required],
          priceModifier: [0, [Validators.required, Validators.min(0)]],
          stock: [0, [Validators.required, Validators.min(0)]],
          sku: ['', Validators.required],
        }),
      ]),
    });
    this.variants.push(variantForm);
  }

  removeVariant(index: number): void {
    this.variants.removeAt(index);
  }

  get variants(): FormArray {
    return this.productForm.get('variants') as FormArray;
  }

  getOptions(variantIndex: number): FormArray {
    return this.variants.at(variantIndex).get('options') as FormArray;
  }

  addOption(variantIndex: number): void {
    const options = this.getOptions(variantIndex);
    options.push(
      this.fb.group({
        value: ['', Validators.required],
        priceModifier: [0, [Validators.required, Validators.min(0)]],
        stock: [0, [Validators.required, Validators.min(0)]],
        sku: ['', Validators.required],
      })
    );
  }

  removeOption(variantIndex: number, optionIndex: number): void {
    const options = this.getOptions(variantIndex);
    options.removeAt(optionIndex);
  }

  private loadDropdownData(): void {
    this.loading = true;

    this.productApi.getStores().subscribe({
      next: (stores) => {
        this.stores = stores;
        this.loading = false;
        if (stores.length > 0)
          this.productForm.patchValue({ store: stores[0]._id });
      },
      error: (err) => {
        console.error('Error loading stores:', err);
        this.loading = false;
      },
    });

    this.productApi.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      },
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const existingFiles = this.productForm.get('images')?.value || [];
      const newFiles = Array.from(input.files);

      const allFiles = [...existingFiles, ...newFiles];

      this.productForm.patchValue({ images: allFiles });

      const newUrls = newFiles.map(file => URL.createObjectURL(file));
      this.imageUrls = [...this.imageUrls, ...newUrls];

      this.cdr.detectChanges();
    }
  }

  // onFileChange(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     const files: File[] = Array.from(input.files);
  //     this.productForm.patchValue({ images: files });
  //     this.productForm.patchValue({ images: files });
  //     this.imageUrls = files.map((file) => URL.createObjectURL(file));
  //     this.cdr.detectChanges();
  //   }
  // }

  removeImage(index: number): void {
    const files = (this.productForm.get('images')?.value as File[]) || [];
    files.splice(index, 1);
    this.imageUrls.splice(index, 1);
    this.productForm.patchValue({ images: files });
    this.cdr.detectChanges();
  }

  getImageUrl(index: number): string {
    return this.imageUrls[index] || '';
  }

  triggerFileInput(): void {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.click();
    }
  }

  // onSubmit(): void {
  //   if (this.productForm.invalid) {
  //     this.productForm.markAllAsTouched();
  //     return;
  //   }

  //   const formValue = this.productForm.value;
  //   if (!formValue.images || formValue.images.length === 0) {
  //     alert('Please add at least one image.');
  //     return;
  //   }

  //   this.submitting = true;
  //   const formData = this.prepareFormData();
  //   console.log('FormData being sent:', Object.fromEntries(formData));

  //   this.productApi.createProduct(formData).subscribe({
  //     next: (product) => {
  //       alert('Product created successfully!');
  //       this.router.navigate(['/products']);
  //     },
  //     error: (err) => {
  //       console.error('Error creating product:', err);
  //       alert('Failed to create product. Please try again.');
  //       this.submitting = false;
  //     },
  //   });
  // }

  // onSubmit(): void {
  //   if (this.productForm.invalid) {
  //     this.productForm.markAllAsTouched();
  //     return;
  //   }

  //   const formValue = this.productForm.value;
  //   if (!formValue.images || formValue.images.length === 0) {
  //     alert('Please add at least one image.');
  //     return;
  //   }

  //   this.submitting = true;
  //   const formData = this.prepareFormData(formValue);  // تمرير القيمة هنا بشكل صحيح
  //   console.log('FormData being sent:', Object.fromEntries(formData));

  //   this.productApi.createProduct(formData).subscribe({
  //     next: (product) => {
  //       alert('Product created successfully!');
  //       this.router.navigate(['/products']);
  //     },
  //     error: (err) => {
  //       console.error('Error creating product:', err);
  //       alert('Failed to create product. Please try again.');
  //       this.submitting = false;
  //     },
  //   });
  // }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formValue = { ...this.productForm.value };

    delete formValue.isActive;
    delete formValue.inStock;

    if (!formValue.images || formValue.images.length === 0) {
      alert('Please add at least one image.');
      return;
    }

    this.submitting = true;
    const formData = this.prepareFormData(formValue);
    console.log('FormData being sent:', Object.fromEntries(formData));

    this.productApi.createProduct(formData).subscribe({
      next: (product) => {
        alert('Product created successfully!');
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('Error creating product:', err);
        alert('Failed to create product. Please try again.');
        this.submitting = false;
      },
    });
  }

  prepareFormData(formValue: any): FormData {
    const formData = new FormData();

    Object.keys(formValue).forEach(key => {
      const value = formValue[key];

      if (value === null || value === undefined) return;

      if (key === 'images' && Array.isArray(value)) {
        value.forEach((file: File) => {
          if (file instanceof File) {
            formData.append('images', file);
          }
        });
      }
      else if (key === 'variants') {
        formData.append('variants', JSON.stringify(value));
      }
      else if (typeof value === 'number') {
        formData.append(key, value.toString());
      }
      else {
        formData.append(key, value);
      }
    });

    return formData;
  }


  // prepareFormData(formValue: any): FormData {
  //   const formData = new FormData();

  //   for (const key in formValue) {
  //     if (!formValue.hasOwnProperty(key)) continue;
  //     const value = formValue[key];
  //     if (value === null || value === undefined) continue;
  //     if (key === 'images') {
  //       const files = Array.isArray(value) ? value : Array.from(value as FileList);
  //       files.forEach((file: File) => {
  //         formData.append('images', file);
  //       });
  //     }
  //     else if (key === 'variants') {
  //       formData.append('variants', JSON.stringify(value));
  //     }
  //     else if (typeof value === 'number') {
  //       formData.append(key, value.toString());
  //     }
  //     else {
  //       formData.append(key, value);
  //     }
  //   }
  //   return formData;
  // }



  // prepareFormData(formValue: any): FormData {
  //   const formData = new FormData();

  //   for (const key in formValue) {
  //     if (!formValue.hasOwnProperty(key)) continue;

  //     if (key === 'images' && Array.isArray(formValue[key])) {
  //       formValue[key].forEach((file: File) => {
  //         formData.append('images', file);
  //       });
  //     } else if (typeof formValue[key] === 'boolean') {
  //       formData.append(key, formValue[key] ? 'true' : 'false');
  //     } else if (Array.isArray(formValue[key]) || typeof formValue[key] === 'object') {
  //       formData.append(key, JSON.stringify(formValue[key]));
  //     } else {
  //       formData.append(key, formValue[key]);
  //     }
  //   }

  //   return formData;
  // }

  // prepareFormData(formValue: any): FormData {
  //   const formData = new FormData();

  //   for (const key in formValue) {
  //     if (!formValue.hasOwnProperty(key)) continue;

  //     if (key === 'images' && Array.isArray(formValue[key])) {
  //       formValue[key].forEach((file: File) => {
  //         formData.append('images', file); // نرسل الصور بنفس الحقل مكرر
  //       });
  //     }
  //     else if (typeof formValue[key] === 'boolean') {
  //       // نرسل القيم المنطقية بدون تحويل لنص
  //       formData.append(key, formValue[key] ? 'true' : 'false');
  //     }
  //     else if (Array.isArray(formValue[key]) || typeof formValue[key] === 'object') {
  //       // أي مصفوفة أو كائن نعمله JSON.stringify
  //       formData.append(key, JSON.stringify(formValue[key]));
  //     }
  //     else {
  //       formData.append(key, formValue[key]);
  //     }
  //   }

  //   return formData;
  // }


  // private prepareFormData(): FormData {
  //   const formValue = this.productForm.value;
  //   const formData = new FormData();

  //   Object.keys(formValue).forEach((key) => {
  //     if (formValue[key] !== null && formValue[key] !== undefined) {
  //       if (key === 'variants') {
  //         formData.append(key, JSON.stringify(formValue[key]));
  //       } else if (key === 'images' && Array.isArray(formValue[key])) {
  //         formValue[key].forEach((file: File) => {
  //           formData.append('images', file);
  //         });
  //       } else if (key === 'basePrice' || key === 'discountPrice') {
  //         formData.append(key, Number(formValue[key]).toString());
  //       } else {
  //         formData.append(key, String(formValue[key]));
  //       }
  //     }
  //   });
  //   return formData;
  // }

  onCancel(): void {
    this.router.navigate(['/products']);
  }

  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field?.invalid && field?.touched) {
      if (field.errors?.['required']) return `${fieldName} is required`;
      if (field.errors?.['minlength'])
        return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors?.['min'])
        return `${fieldName} must be at least ${field.errors['min'].min}`;
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return (field?.invalid && field?.touched) || false;
  }

  getDiscountPercentage(): number {
    const basePrice = this.productForm.get('basePrice')?.value || 0;
    const discountPrice = this.productForm.get('discountPrice')?.value || 0;

    if (basePrice > 0 && discountPrice > 0 && discountPrice < basePrice) {
      return Math.round(((basePrice - discountPrice) / basePrice) * 100);
    }
    return 0;
  }
}
