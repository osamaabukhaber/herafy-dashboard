// //#region
// // src/app/features/products/components/product-form/product-form.component.ts
// import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { Subject, takeUntil } from 'rxjs';

// import { ProductApiService } from '../../services/product-api.service';
// import { Product, ProductVariant, ProductCreateRequest, ProductUpdateRequest } from '../../../../shared/models/product.interface';

// import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
// import { LoadingComponent } from '../../../../shared/components/ui/loading/loading.component';
// import { CustomCurrencyPipe } from '../../../../shared/pipes/currency.pipe.js';
// // import { CustomCurrencyPipe } from '../../../../shared/pipes';

// @Component({
//   selector: 'app-product-form',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     ButtonComponent,
//     LoadingComponent,
//     // CustomCurrencyPipe
//   ],
//   template: `
//     <div class="max-w-4xl mx-auto p-6">
//       <!-- Header -->
//       <div class="flex items-center justify-between mb-6">
//         <div>
//           <h1 class="text-2xl font-bold text-gray-900">
//             {{ isEditMode() ? 'Edit Product' : 'Create New Product' }}
//           </h1>
//           <p class="text-gray-600 mt-1">
//             {{ isEditMode() ? 'Update product information' : 'Add a new product to your catalog' }}
//           </p>
//         </div>
//         <app-button variant="outline" (onClick)="goBack()">
//           <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
//           </svg>
//           Back to Products
//         </app-button>
//       </div>

//       @if (loading()) {
//         <app-loading type="skeleton" message="Loading product data..." />
//       } @else {
//         <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="space-y-8">
//           <!-- Basic Information -->
//           <div class="bg-white rounded-lg shadow-sm border p-6">
//             <h3 class="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
//             <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <!-- Product Name -->
//               <div class="md:col-span-2">
//                 <label class="block text-sm font-medium text-gray-700 mb-1">
//                   Product Name *
//                 </label>
//                 <input
//                   type="text"
//                   formControlName="name"
//                   placeholder="Enter product name"
//                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   [class.border-red-300]="productForm.get('name')?.invalid && productForm.get('name')?.touched"
//                 >
//                 @if (productForm.get('name')?.invalid && productForm.get('name')?.touched) {
//                   <p class="mt-1 text-sm text-red-600">Product name is required</p>
//                 }
//               </div>

//               <!-- Store -->
//               <div>
//                 <label class="block text-sm font-medium text-gray-700 mb-1">
//                   Store *
//                 </label>
//                 <select
//                   formControlName="store"
//                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   [class.border-red-300]="productForm.get('store')?.invalid && productForm.get('store')?.touched"
//                 >
//                   <option value="">Select a store</option>
//                   @for (store of stores(); track store.id) {
//                     <option [value]="store.id">{{ store.name }}</option>
//                   }
//                 </select>
//                 @if (productForm.get('store')?.invalid && productForm.get('store')?.touched) {
//                   <p class="mt-1 text-sm text-red-600">Store selection is required</p>
//                 }
//               </div>

//               <!-- Category -->
//               <div>
//                 <label class="block text-sm font-medium text-gray-700 mb-1">
//                   Category *
//                 </label>
//                 <select
//                   formControlName="category"
//                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   [class.border-red-300]="productForm.get('category')?.invalid && productForm.get('category')?.touched"
//                 >
//                   <option value="">Select a category</option>
//                   @for (category of categories(); track category.id) {
//                     <option [value]="category.id">{{ category.name }}</option>
//                   }
//                 </select>
//                 @if (productForm.get('category')?.invalid && productForm.get('category')?.touched) {
//                   <p class="mt-1 text-sm text-red-600">Category selection is required</p>
//                 }
//               </div>

//               <!-- Description -->
//               <div class="md:col-span-2">
//                 <label class="block text-sm font-medium text-gray-700 mb-1">
//                   Description *
//                 </label>
//                 <textarea
//                   formControlName="description"
//                   rows="4"
//                   placeholder="Enter product description"
//                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//                   [class.border-red-300]="productForm.get('description')?.invalid && productForm.get('description')?.touched"
//                 ></textarea>
//                 @if (productForm.get('description')?.invalid && productForm.get('description')?.touched) {
//                   <p class="mt-1 text-sm text-red-600">Description is required</p>
//                 }
//               </div>
//             </div>
//           </div>

//           <!-- Pricing -->
//           <div class="bg-white rounded-lg shadow-sm border p-6">
//             <h3 class="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
//             <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <!-- Base Price -->
//               <div>
//                 <label class="block text-sm font-medium text-gray-700 mb-1">
//                   Base Price (SAR) *
//                 </label>
//                 <input
//                   type="number"
//                   formControlName="basePrice"
//                   min="0"
//                   step="0.01"
//                   placeholder="0.00"
//                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   [class.border-red-300]="productForm.get('basePrice')?.invalid && productForm.get('basePrice')?.touched"
//                 >
//                 @if (productForm.get('basePrice')?.invalid && productForm.get('basePrice')?.touched) {
//                   <p class="mt-1 text-sm text-red-600">Valid base price is required</p>
//                 }
//               </div>

//               <!-- Discount Price -->
//               <div>
//                 <label class="block text-sm font-medium text-gray-700 mb-1">
//                   Discount Price (SAR)
//                 </label>
//                 <input
//                   type="number"
//                   formControlName="discountPrice"
//                   min="0"
//                   step="0.01"
//                   placeholder="0.00"
//                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//               </div>

//               <!-- Discount Percentage Display -->
//               @if (discountPercentage() > 0) {
//                 <div class="flex items-end">
//                   <div class="bg-green-100 text-green-800 px-3 py-2 rounded-md text-sm font-medium">
//                     {{ discountPercentage() }}% off
//                   </div>
//                 </div>
//               }
//             </div>

//             <!-- Discount Period -->
//             @if (productForm.get('discountPrice')?.value > 0) {
//               <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//                 <div>
//                   <label class="block text-sm font-medium text-gray-700 mb-1">
//                     Discount Start Date
//                   </label>
//                   <input
//                     type="datetime-local"
//                     formControlName="discountStart"
//                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                 </div>
//                 <div>
//                   <label class="block text-sm font-medium text-gray-700 mb-1">
//                     Discount End Date
//                   </label>
//                   <input
//                     type="datetime-local"
//                     formControlName="discountEnd"
//                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                 </div>
//               </div>
//             }
//           </div>

//           <!-- Product Images -->
//           <div class="bg-white rounded-lg shadow-sm border p-6">
//             <h3 class="text-lg font-semibold text-gray-900 mb-4">Product Images</h3>

//             <!-- Image Upload -->
//             <div class="mb-6">
//               <div class="flex items-center justify-center w-full">
//                 <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
//                   <div class="flex flex-col items-center justify-center pt-5 pb-6">
//                     <svg class="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
//                     </svg>
//                     <p class="mb-2 text-sm text-gray-500">
//                       <span class="font-semibold">Click to upload</span> or drag and drop
//                     </p>
//                     <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
//                   </div>
//                   <input
//                     type="file"
//                     class="hidden"
//                     multiple
//                     accept="image/*"
//                     (change)="onImageSelect($event)"
//                   >
//                 </label>
//               </div>
//             </div>

//             <!-- Image Preview -->
//             @if (productImages().length > 0) {
//               <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 @for (image of productImages(); track $index) {
//                   <div class="relative group">
//                     <img
//                       [src]="image"
//                       [alt]="'Product image ' + ($index + 1)"
//                       class="w-full h-24 object-cover rounded-lg border"
//                     >
//                     <button
//                       type="button"
//                       class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
//                       (click)="removeImage($index)"
//                     >
//                       <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
//                       </svg>
//                     </button>
//                   </div>
//                 }
//               </div>
//             }
//           </div>

//           <!-- Product Variants -->
//           <div class="bg-white rounded-lg shadow-sm border p-6">
//             <div class="flex items-center justify-between mb-4">
//               <h3 class="text-lg font-semibold text-gray-900">Product Variants</h3>
//               <app-button type="button" variant="outline" size="sm" (onClick)="addVariant()">
//                 <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
//                 </svg>
//                 Add Variant
//               </app-button>
//             </div>

//             <div formArrayName="variants" class="space-y-6">
//               @for (variant of variantsArray.controls; track $index) {
//                 <div [formGroupName]="$index" class="border rounded-lg p-4">
//                   <div class="flex items-center justify-between mb-4">
//                     <h4 class="font-medium text-gray-900">Variant {{ $index + 1 }}</h4>
//                     <app-button
//                       type="button"
//                       variant="danger"
//                       size="sm"
//                       (onClick)="removeVariant($index)"
//                     >
//                       Remove
//                     </app-button>
//                   </div>

//                   <!-- Variant Name -->
//                   <div class="mb-4">
//                     <label class="block text-sm font-medium text-gray-700 mb-1">
//                       Variant Name
//                     </label>
//                     <input
//                       type="text"
//                       formControlName="name"
//                       placeholder="e.g., Size, Color, Material"
//                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                   </div>

//                   <!-- Variant Options -->
//                   <div formArrayName="options">
//                     <div class="flex items-center justify-between mb-3">
//                       <label class="block text-sm font-medium text-gray-700">Options</label>
//                       <app-button
//                         type="button"
//                         variant="outline"
//                         size="sm"
//                         (onClick)="addVariantOption($index)"
//                       >
//                         Add Option
//                       </app-button>
//                     </div>

//                     @for (option of getVariantOptions($index).controls; track $j; let $j = $index) {
//                       <div [formGroupName]="$j" class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 p-3 bg-gray-50 rounded">
//                         <div>
//                           <input
//                             type="text"
//                             formControlName="value"
//                             placeholder="Option value"
//                             class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                           >
//                         </div>
//                         <div>
//                           <input
//                             type="number"
//                             formControlName="priceModifier"
//                             placeholder="Price modifier"
//                             step="0.01"
//                             class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                           >
//                         </div>
//                         <div>
//                           <input
//                             type="number"
//                             formControlName="stock"
//                             placeholder="Stock"
//                             min="0"
//                             class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                           >
//                         </div>
//                         <div class="flex items-center space-x-2">
//                           <input
//                             type="text"
//                             formControlName="sku"
//                             placeholder="SKU"
//                             class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                           >
//                           <app-button
//                             type="button"
//                             variant="danger"
//                             size="sm"
//                             (onClick)="removeVariantOption($index, $j)"
//                           >
//                             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
//                             </svg>
//                           </app-button>
//                         </div>
//                       </div>
//                     }

//                     @if (getVariantOptions($index).length === 0) {
//                       <div class="text-center py-4 text-gray-500 text-sm">
//                         No options added yet. Click "Add Option" to get started.
//                       </div>
//                     }
//                   </div>
//                 </div>
//               }
//             </div>

//             @if (variantsArray.length === 0) {
//               <div class="text-center py-8 text-gray-500">
//                 <p class="text-sm">No variants added yet.</p>
//                 <p class="text-xs mt-1">Add variants if your product has different options like size, color, etc.</p>
//               </div>
//             }
//           </div>

//           <!-- Form Actions -->
//           <div class="flex items-center justify-end space-x-4 pt-6 border-t">
//             <app-button type="button" variant="outline" (onClick)="goBack()">
//               Cancel
//             </app-button>
//             <app-button
//               type="submit"
//               variant="primary"
//               [loading]="saveLoading()"
//               [disabled]="productForm.invalid"
//             >
//               {{ isEditMode() ? 'Update Product' : 'Create Product' }}
//             </app-button>
//           </div>
//         </form>
//       }
//     </div>
//   `
// })
// export class ProductFormComponent implements OnInit, OnDestroy {
//   private readonly destroy$ = new Subject<void>();
//   private readonly fb = inject(FormBuilder);
//   private readonly route = inject(ActivatedRoute);
//   private readonly router = inject(Router);
//   private readonly productApiService = inject(ProductApiService);

//   // Signals
//   loading = signal(false);
//   saveLoading = signal(false);
//   isEditMode = signal(false);
//   productId = signal<string | null>(null);
//   productImages = signal<string[]>([]);
//   stores = signal<Array<{id: string, name: string}>>([]);
//   categories = signal<Array<{id: string, name: string}>>([]);

//   // Computed
//   discountPercentage = computed(() => {
//     const basePrice = this.productForm.get('basePrice')?.value || 0;
//     const discountPrice = this.productForm.get('discountPrice')?.value || 0;

//     if (basePrice > 0 && discountPrice > 0 && discountPrice < basePrice) {
//       return Math.round(((basePrice - discountPrice) / basePrice) * 100);
//     }
//     return 0;
//   });

//   // Form
//   productForm: FormGroup = this.fb.group({
//     name: ['', [Validators.required, Validators.minLength(3)]],
//     description: ['', [Validators.required, Validators.minLength(10)]],
//     basePrice: [0, [Validators.required, Validators.min(0.01)]],
//     discountPrice: [0, [Validators.min(0)]],
//     discountStart: [''],
//     discountEnd: [''],
//     store: ['', Validators.required],
//     category: ['', Validators.required],
//     images: [[]],
//     variants: this.fb.array([])
//   });

//   get variantsArray(): FormArray {
//     return this.productForm.get('variants') as FormArray;
//   }

//   ngOnInit(): void {
//     this.loadDropdownData();
//     this.checkEditMode();
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }

//   private checkEditMode(): void {
//     const id = this.route.snapshot.paramMap.get('id');
//     if (id && id !== 'create') {
//       this.isEditMode.set(true);
//       this.productId.set(id);
//       this.loadProduct(id);
//     }
//   }

//   private loadProduct(id: string): void {
//     this.loading.set(true);
//     this.productApiService.getProductById(id)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (response) => {
//           const product = response.data;
//           this.populateForm(product);
//           this.loading.set(false);
//         },
//         error: (error) => {
//           console.error('Error loading product:', error);
//           this.loading.set(false);
//         }
//       });
//   }

//   private populateForm(product: Product): void {
//     // Set basic form values
//     this.productForm.patchValue({
//       name: product.name,
//       description: product.description,
//       basePrice: product.basePrice,
//       discountPrice: product.discountPrice,
//       discountStart: product.discountStart ? new Date(product.discountStart).toISOString().slice(0, 16) : '',
//       discountEnd: product.discountEnd ? new Date(product.discountEnd).toISOString().slice(0, 16) : '',
//       store: product.store,
//       category: product.category
//     });

//     // Set images
//     this.productImages.set(product.images);

//     // Set variants
//     this.variantsArray.clear();
//     product.variants.forEach(variant => {
//       this.addVariantFromData(variant);
//     });
//   }

//   private loadDropdownData(): void {
//     // Load stores - this would typically come from a store service
//     this.stores.set([
//       { id: '1', name: 'Main Store' },
//       { id: '2', name: 'Online Store' },
//       { id: '3', name: 'Outlet Store' }
//     ]);

//     // Load categories - this would typically come from a category service
//     this.categories.set([
//       { id: '1', name: 'Electronics' },
//       { id: '2', name: 'Clothing' },
//       { id: '3', name: 'Food & Beverages' },
//       { id: '4', name: 'Home & Garden' }
//     ]);
//   }

//   onImageSelect(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     if (input.files) {
//       Array.from(input.files).forEach(file => {
//         if (file.type.startsWith('image/')) {
//           this.uploadImage(file);
//         }
//       });
//     }
//   }

//   private uploadImage(file: File): void {
//     // In a real app, you'd upload to a file service
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const imageUrl = e.target?.result as string;
//       this.productImages.update(images => [...images, imageUrl]);
//     };
//     reader.readAsDataURL(file);
//   }

//   removeImage(index: number): void {
//     this.productImages.update(images => images.filter((_, i) => i !== index));
//   }

//   addVariant(): void {
//     const variantGroup = this.fb.group({
//       name: ['', Validators.required],
//       isDeleted: [false],
//       options: this.fb.array([])
//     });
//     this.variantsArray.push(variantGroup);
//   }

//   private addVariantFromData(variant: ProductVariant): void {
//     const variantGroup = this.fb.group({
//       name: [variant.name, Validators.required],
//       isDeleted: [variant.isDeleted],
//       options: this.fb.array([])
//     });

//     const optionsArray = variantGroup.get('options') as FormArray;
//     variant.options.forEach(option => {
//       optionsArray.push(this.fb.group({
//         value: [option.value, Validators.required],
//         priceModifier: [option.priceModifier, Validators.required],
//         stock: [option.stock, [Validators.required, Validators.min(0)]],
//         sku: [option.sku, Validators.required]
//       }));
//     });

//     this.variantsArray.push(variantGroup);
//   }

//   removeVariant(index: number): void {
//     this.variantsArray.removeAt(index);
//   }

//   getVariantOptions(variantIndex: number): FormArray {
//     const variant = this.variantsArray.at(variantIndex);
//     return variant.get('options') as FormArray;
//   }

//   addVariantOption(variantIndex: number): void {
//     const optionsArray = this.getVariantOptions(variantIndex);
//     const optionGroup = this.fb.group({
//       value: ['', Validators.required],
//       priceModifier: [0, Validators.required],
//       stock: [0, [Validators.required, Validators.min(0)]],
//       sku: ['', Validators.required]
//     });
//     optionsArray.push(optionGroup);
//   }

//   removeVariantOption(variantIndex: number, optionIndex: number): void {
//     const optionsArray = this.getVariantOptions(variantIndex);
//     optionsArray.removeAt(optionIndex);
//   }

//   onSubmit(): void {
//     if (this.productForm.invalid) {
//       this.markFormGroupTouched(this.productForm);
//       return;
//     }

//     this.saveLoading.set(true);
//     const formData = this.prepareFormData();

//     const request = this.isEditMode()
//       ? this.productApiService.updateProduct(this.productId()!, formData as ProductUpdateRequest)
//       : this.productApiService.createProduct(formData as ProductCreateRequest);

//     request.pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (response) => {
//           this.saveLoading.set(false);
//           this.router.navigate(['/products']);
//         },
//         error: (error) => {
//           console.error('Error saving product:', error);
//           this.saveLoading.set(false);
//         }
//       });
//   }

//   private prepareFormData(): ProductCreateRequest | ProductUpdateRequest {
//     const formValue = this.productForm.value;

//     const data: any = {
//       ...formValue,
//       images: this.productImages(),
//       discountStart: formValue.discountStart ? new Date(formValue.discountStart) : undefined,
//       discountEnd: formValue.discountEnd ? new Date(formValue.discountEnd) : undefined
//     };

//     if (this.isEditMode()) {
//       data._id = this.productId();
//     }

//     return data;
//   }

//   private markFormGroupTouched(formGroup: FormGroup): void {
//     Object.keys(formGroup.controls).forEach(key => {
//       const control = formGroup.get(key);
//       control?.markAsTouched();

//       if (control instanceof FormGroup) {
//         this.markFormGroupTouched(control);
//       } else if (control instanceof FormArray) {
//         control.controls.forEach(ctrl => {
//           if (ctrl instanceof FormGroup) {
//             this.markFormGroupTouched(ctrl);
//           }
//         });
//       }
//     });
//   }

//   goBack(): void {
//     this.router.navigate(['/products']);
//   }
// }

//endredio



//#region

// import { Component, inject, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms'; // Keep ReactiveFormsModule
// import { ActivatedRoute, Router, RouterLink } from '@angular/router'; // Import RouterLink
// import { ProductApiService } from '../../services/product-api.service';
// import { switchMap, of } from 'rxjs';
// import { Product } from '../../../../shared/models/product.interface.js';

// // Import any shared form components you might use
// // import { ButtonComponent } from '@shared/components/ui/button/button.component';
// // import { FileUploadComponent } from '@shared/components/forms/file-upload/file-upload.component';

// @Component({
//   selector: 'app-product-form',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     // RouterLink,
//     // ButtonComponent,
//     // FileUploadComponent
//   ],
//   templateUrl: './product-form.component.html',
// })
// export class ProductFormComponent implements OnInit {
//   // ... all component logic remains exactly the same
//   private fb = inject(FormBuilder);
//   private router = inject(Router);
//   private route = inject(ActivatedRoute);
//   private productApi = inject(ProductApiService);

//   productForm!: FormGroup;
//   isEditMode = false;
//   private productId: string | null = null;

//   ngOnInit(): void {
//     this.initForm();

//     // Check for an ID in the route to determine if we are in "edit" mode
//     this.route.paramMap.pipe(
//       switchMap(params => {
//         this.productId = params.get('id');
//         if (this.productId) {
//           this.isEditMode = true;
//           return this.productApi.getProductById(this.productId);
//         }
//         return of(null);
//       })
//     ).subscribe(product => {
//       if (product) {
//         this.patchForm(product); // Populate form with existing product data
//       }
//     });
//   }

//   // Initialize the main form structure
//   private initForm(): void {
//     this.productForm = this.fb.group({
//       name: ['', Validators.required],
//       description: ['', Validators.required],
//       basePrice: [0, [Validators.required, Validators.min(0)]],
//       category: ['', Validators.required], // Assuming this will be a select dropdown
//       images: this.fb.array([]), // Handle image uploads separately
//       variants: this.fb.array([]),
//     });
//   }

//   // Getters for easy template access to FormArrays
//   get variants(): FormArray {
//     return this.productForm.get('variants') as FormArray;
//   }

//   options(variantIndex: number): FormArray {
//     return this.variants.at(variantIndex).get('options') as FormArray;
//   }

//   // Dynamically add a new variant group
//   addVariant(): void {
//     const variantForm = this.fb.group({
//       name: ['', Validators.required],
//       options: this.fb.array([]),
//     });
//     this.variants.push(variantForm);
//   }

//   // Remove a variant
//   removeVariant(index: number): void {
//     this.variants.removeAt(index);
//   }

//   // Dynamically add a new option to a variant
//   addOption(variantIndex: number): void {
//     const optionForm = this.fb.group({
//       value: ['', Validators.required],
//       priceModifier: [0],
//       stock: [0, Validators.required],
//       sku: [''],
//     });
//     this.options(variantIndex).push(optionForm);
//   }

//   // Remove an option
//   removeOption(variantIndex: number, optionIndex: number): void {
//     this.options(variantIndex).removeAt(optionIndex);
//   }

//   // Populate the form when in edit mode
//   private patchForm(product: Product): void {
//     this.productForm.patchValue(product);

//     // Clear and populate variants form array
//     this.variants.clear();
//     product.variants.forEach(variant => {
//       const variantGroup = this.fb.group({
//         name: [variant.name, Validators.required],
//         options: this.fb.array(
//           variant.options.map(option => this.fb.group({
//             value: [option.value, Validators.required],
//             priceModifier: [option.priceModifier],
//             stock: [option.stock, Validators.required],
//             sku: [option.sku],
//           }))
//         ),
//       });
//       this.variants.push(variantGroup);
//     });
//   }

//   // Handle form submission
//   onSubmit(): void {
//     if (this.productForm.invalid) {
//       this.productForm.markAllAsTouched();
//       return;
//     }

//     const formData = this.productForm.value;
//     const apiCall = this.isEditMode
//       ? this.productApi.updateProduct(this.productId!, formData)
//       : this.productApi.createProduct(formData);

//     apiCall.subscribe({
//       next: () => this.router.navigate(['/products']), // Navigate back to list on success
//       error: (err) => console.error('Failed to save product', err),
//     });
//   }
// }


//#endregion
//*!

// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { Router, ActivatedRoute } from '@angular/router';
// import { ProductApiService } from '../../services/product-api.service';
// import { CreateProductRequest, UpdateProductRequest, Product } from '../../../../shared/models/product.interface';

// @Component({
//   selector: 'app-product-form',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './product-form.component.html'
// })
// export class ProductFormComponent implements OnInit {
//   productForm: FormGroup;
//   isEditMode = false;
//   productId: string | null = null;
//   loading = false;
//   categories: any[] = []; // TODO: Replace with Category interface
//   stores: any[] = []; // TODO: Replace with Store interface

//   constructor(
//     private fb: FormBuilder,
//     private productApiService: ProductApiService,
//     private router: Router,
//     private route: ActivatedRoute
//   ) {
//     this.productForm = this.fb.group({
//       name: ['', [Validators.required, Validators.minLength(3)]],
//       description: ['', [Validators.required, Validators.minLength(10)]],
//       price: ['', [Validators.required, Validators.min(0)]],
//       originalPrice: ['', [Validators.min(0)]],
//       category: ['', Validators.required],
//       store: ['', Validators.required],
//       images: [[]],
//       variants: [[]],
//       specifications: [{}],
//       tags: [[]],
//       isActive: [true],
//       inStock: [true],
//       stockQuantity: ['', [Validators.required, Validators.min(0)]],
//       sku: ['', [Validators.required]],
//       weight: ['', [Validators.min(0)]],
//       dimensions: this.fb.group({
//         length: ['', [Validators.min(0)]],
//         width: ['', [Validators.min(0)]],
//         height: ['', [Validators.min(0)]]
//       })
//     });
//   }

//   ngOnInit(): void {
//     this.loadCategories();
//     this.loadStores();

//     // Check if we're in edit mode
//     this.productId = this.route.snapshot.paramMap.get('id');
//     if (this.productId) {
//       this.isEditMode = true;
//       this.loadProduct(this.productId);
//     }
//   }

//   loadProduct(id: string): void {
//     this.loading = true;
//     this.productApiService.getProductById(id)
//       .subscribe({
//         next: (product) => {
//           this.productForm.patchValue({
//             name: product.name,
//             description: product.description,
//             price: product.price,
//             originalPrice: product.originalPrice,
//             category: typeof product.category === 'string' ? product.category : product.category._id,
//             store: typeof product.store === 'string' ? product.store : product.store._id,
//             images: product.images,
//             variants: product.variants || [],
//             specifications: product.specifications || {},
//             tags: product.tags || [],
//             isActive: product.isActive,
//             inStock: product.inStock,
//             stockQuantity: product.stockQuantity,
//             sku: product.sku,
//             weight: product.weight,
//             dimensions: product.dimensions || { length: '', width: '', height: '' }
//           });
//           this.loading = false;
//         },
//         error: (error) => {
//           console.error('Error loading product:', error);
//           this.loading = false;
//         }
//       });
//   }

//   loadCategories(): void {
//     // TODO: Implement category service
//     this.categories = [
//       { _id: '1', name: 'Electronics' },
//       { _id: '2', name: 'Clothing' },
//       { _id: '3', name: 'Books' }
//     ];
//   }

//   loadStores(): void {
//     // TODO: Implement store service
//     this.stores = [
//       { _id: '1', name: 'Store 1' },
//       { _id: '2', name: 'Store 2' },
//       { _id: '3', name: 'Store 3' }
//     ];
//   }

//   onSubmit(): void {
//     if (this.productForm.valid) {
//       this.loading = true;
//       const formData = this.productForm.value;

//       if (this.isEditMode && this.productId) {
//         // Update existing product
//         const updateData: UpdateProductRequest = {
//           name: formData.name,
//           description: formData.description,
//           price: formData.price,
//           originalPrice: formData.originalPrice,
//           category: formData.category,
//           images: formData.images,
//           variants: formData.variants,
//           specifications: formData.specifications,
//           tags: formData.tags,
//           isActive: formData.isActive,
//           inStock: formData.inStock,
//           stockQuantity: formData.stockQuantity,
//           weight: formData.weight,
//           dimensions: formData.dimensions
//         };

//         this.productApiService.updateProduct(this.productId, updateData)
//           .subscribe({
//             next: () => {
//               this.router.navigate(['/products']);
//             },
//             error: (error) => {
//               console.error('Error updating product:', error);
//               this.loading = false;
//             }
//           });
//       } else {
//         // Create new product
//         const createData: CreateProductRequest = {
//           name: formData.name,
//           description: formData.description,
//           price: formData.price,
//           originalPrice: formData.originalPrice,
//           category: formData.category,
//           store: formData.store,
//           images: formData.images,
//           variants: formData.variants,
//           specifications: formData.specifications,
//           tags: formData.tags,
//           isActive: formData.isActive,
//           inStock: formData.inStock,
//           stockQuantity: formData.stockQuantity,
//           sku: formData.sku,
//           weight: formData.weight,
//           dimensions: formData.dimensions
//         };

//         this.productApiService.createProduct(createData)
//           .subscribe({
//             next: () => {
//               this.router.navigate(['/products']);
//             },
//             error: (error) => {
//               console.error('Error creating product:', error);
//               this.loading = false;
//             }
//           });
//       }
//     }
//   }

//   onCancel(): void {
//     this.router.navigate(['/products']);
//   }

//   addTag(tag: string): void {
//     const currentTags = this.productForm.get('tags')?.value || [];
//     if (tag && !currentTags.includes(tag)) {
//       this.productForm.get('tags')?.setValue([...currentTags, tag]);
//     }
//   }

//   removeTag(tag: string): void {
//     const currentTags = this.productForm.get('tags')?.value || [];
//     this.productForm.get('tags')?.setValue(currentTags.filter((t: string) => t !== tag));
//   }
// }
