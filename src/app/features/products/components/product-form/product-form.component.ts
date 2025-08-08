import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

  productForm!: FormGroup;
  stores: { _id: string; name: string }[] = [];
  categories: Category[] = [];
  loading = false;
  submitting = false;
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
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      sku: ['', Validators.required],
      weight: [null, [Validators.min(0)]],
      isActive: [true],
      inStock: [true],
      images: [[]],
    });
  }

  private loadDropdownData(): void {
    this.loading = true;

    // Load stores
    this.productApi.getStores().subscribe({
      next: (stores) => {
        this.stores = stores;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading stores:', err);
        this.loading = false;
      }
    });

    // Load categories
    this.productApi.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }

  onImageUrlAdd(imageUrl: string): void {
    if (imageUrl && imageUrl.trim()) {
      this.imageUrls.push(imageUrl.trim());
      this.productForm.patchValue({ images: this.imageUrls });
    }
  }

  removeImage(index: number): void {
    this.imageUrls.splice(index, 1);
    this.productForm.patchValue({ images: this.imageUrls });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const formData = this.prepareFormData();

    this.productApi.createProduct(formData).subscribe({
      next: (product) => {
        alert('Product created successfully!');
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('Error creating product:', err);
        alert('Failed to create product. Please try again.');
        this.submitting = false;
      }
    });
  }

  private prepareFormData(): FormData {
    const formValue = this.productForm.value;
    const formData = new FormData();

    // Add form fields
    Object.keys(formValue).forEach(key => {
      if (formValue[key] !== null && formValue[key] !== undefined) {
        if (key === 'images') {
          // Handle images as array
          formValue[key].forEach((imageUrl: string) => {
            formData.append('images', imageUrl);
          });
        } else {
          formData.append(key, String(formValue[key]));
        }
      }
    });

    return formData;
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }

  // Helper methods for template
  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field?.invalid && field?.touched) {
      if (field.errors?.['required']) return `${fieldName} is required`;
      if (field.errors?.['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors?.['min']) return `${fieldName} must be at least ${field.errors['min'].min}`;
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return field?.invalid && field?.touched || false;
  }

  // Calculate discount percentage
  getDiscountPercentage(): number {
    const basePrice = this.productForm.get('basePrice')?.value || 0;
    const discountPrice = this.productForm.get('discountPrice')?.value || 0;

    if (basePrice > 0 && discountPrice > 0 && discountPrice < basePrice) {
      return Math.round(((basePrice - discountPrice) / basePrice) * 100);
    }
    return 0;
  }
}
