// src/app/product/product-list/product-list.component.ts
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductApiService } from '../../services/product-api.service';
import { Product, ProductVariant, ProductVariantOption } from '../../../../shared/models/product.interface';
import { ProductListBackendResponse } from '../../../../shared/models/Api Responses/productResponse';
import { CustomCurrencyPipe } from '../../../../shared/pipes/currency.pipe';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, CustomCurrencyPipe],
  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {
  private productApi = inject(ProductApiService);
  private cdr = inject(ChangeDetectorRef);

  products: Product[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit() {
    this.loading = true;
    this.productApi.getProducts().subscribe({
      next: (res: ProductListBackendResponse) => {
        console.log('Data received:', res);
        this.products = res.products;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load products';
        this.loading = false;
      },
    });
  }

  fetchProducts(): void {
    this.loading = true;
    this.error = null;
    this.productApi.getProducts().subscribe({
      next: (response: ProductListBackendResponse) => {
        this.products = response.products;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products. Please try again later.';
        console.error(err);
        this.loading = false;
      },
    });
  }

  deleteProduct(id: string): void {
  this.productApi.deleteProduct(id).subscribe({
    next: () => {

      this.products = this.products.filter(p => p._id !== id);
      console.log(`Product ${id} deleted successfully.`);
    },
    error: (err) => {
      this.error = `Failed to delete product ${id}.`;
      console.error(err);
      this.fetchProducts();
    },
  });
}


  // deleteProduct(id: string): void {
  //   this.products = this.products.filter(p => p._id !== id);

  //   this.productApi.deleteProduct(id).subscribe({
  //     next: () => {
  //       console.log(`Product ${id} deleted successfully.`);
  //     },
  //     error: (err) => {
  //       this.error = `Failed to delete product ${id}.`;
  //       console.error(err);
  //       this.fetchProducts();
  //     },
  //   });
  // }

  // getStatusClass(status: 'In Stock' | 'Out of Stock' | 'Low Stock'): string {
  //   switch (status) {
  //     case 'In Stock':
  //       return 'bg-green-100 text-green-800';
  //     case 'Out of Stock':
  //       return 'bg-red-100 text-red-800';
  //     case 'Low Stock':
  //       return 'bg-yellow-100 text-yellow-800';
  //     default:
  //       return 'bg-gray-100 text-gray-800';
  //   }
  // }


  getStockStatus(product: Product): string {
  const totalStock = product.variants.options.reduce((sum, option) => sum + option.stock, 0);
  if (totalStock === 0) return 'Out of Stock';
  if (totalStock < 5) return 'Low Stock';
  return 'In Stock';
}

getStatusClass(status: string): string {
  return {
    'In Stock': 'bg-green-100 text-green-800',
    'Low Stock': 'bg-yellow-100 text-yellow-800',
    'Out of Stock': 'bg-red-100 text-red-800',
  }[status] || 'bg-gray-100 text-gray-800';
}


getTotalStock(product: Product): number {
  if (!product.variants || !Array.isArray(product.variants)) return 0;

  return product.variants.reduce((total: number, variant: ProductVariant) => {
    const options = Array.isArray(variant.options) ? variant.options : [];
    return total + options.reduce((sum: number, option: ProductVariantOption) => sum + (option.stock || 0), 0);
  }, 0);
}




}




// // src/app/features/products/components/product-list/product-list.component.ts
// import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

// import { ProductApiService } from '../../services/product-api.service';
// import { ProductFilterService } from '../../services/product-filter.service';
// import { Product, ProductSearchParams } from '../../../../shared/models/product.interface';

// import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
// // import { ModalComponent } from '../../../../shared/components/ui/model/modal.component';
// import { LoadingComponent } from '../../../../shared/components/ui/loading/loading.component';
// import { CustomCurrencyPipe } from '../../../../shared/pipes/currency.pipe.js';
// import { CustomDatePipe } from '../../../../shared/pipes/date.pipe.js';
// import { DiscountPercentagePipe } from '../../../../shared/pipes/discount.pipe.js';
// import { StockStatusPipe } from '../../../../shared/pipes/stock-status.pipe.js';
// import { TextTruncatePipe } from '../../../../shared/pipes/text-truncate.pipe.js';

// import {
//   CustomCurrencyPipe,
//   CustomDatePipe,
//   DiscountPercentagePipe,
//   StockStatusPipe,
//   TextTruncatePipe
// } from '../../../../shared/pipes/';

// @Component({
//   selector: 'app-product-list',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     ButtonComponent,
//     // ModalComponent,
//     LoadingComponent,
//     CustomCurrencyPipe,
//     // CustomDatePipe,
//     DiscountPercentagePipe,
//     StockStatusPipe,
//     TextTruncatePipe
//   ],
//   template: `
//     <div class="p-6">
//       <!-- Header -->
//       <div class="flex justify-between items-center mb-6">
//         <div>
//           <h1 class="text-2xl font-bold text-gray-900">Products</h1>
//           <p class="text-gray-600 mt-1">
//             Manage your product catalog ({{ filteredProductsCount() }} of {{ totalProductsCount() }})
//           </p>
//         </div>
//         <app-button variant="primary" (onClick)="navigateToCreateProduct()">
//           <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
//           </svg>
//           Add Product
//         </app-button>
//       </div>

//       <!-- Filters -->
//       <div class="bg-white rounded-lg shadow-sm border p-4 mb-6">
//         <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <!-- Search -->
//           <div>
//             <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
//             <input
//               type="text"
//               [(ngModel)]="searchQuery"
//               (ngModelChange)="onSearchChange($event)"
//               placeholder="Search products..."
//               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//           </div>

//           <!-- Category Filter -->
//           <div>
//             <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
//             <select
//               [(ngModel)]="selectedCategory"
//               (ngModelChange)="onCategoryChange($event)"
//               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">All Categories</option>
//               @for (category of categories(); track category.id) {
//                 <option [value]="category.id">{{ category.name }}</option>
//               }
//             </select>
//           </div>

//           <!-- Status Filter -->
//           <div>
//             <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
//             <select
//               [(ngModel)]="selectedStatus"
//               (ngModelChange)="onStatusChange($event)"
//               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">All</option>
//               <option value="in-stock">In Stock</option>
//               <option value="low-stock">Low Stock</option>
//               <option value="out-of-stock">Out of Stock</option>
//               <option value="on-discount">On Discount</option>
//             </select>
//           </div>

//           <!-- Actions -->
//           <div class="flex items-end space-x-2">
//             <app-button variant="outline" size="sm" (onClick)="resetFilters()">
//               Reset Filters
//             </app-button>
//             @if (selectedProducts().length > 0) {
//               <app-button variant="danger" size="sm" (onClick)="showBulkDeleteModal = true">
//                 Delete ({{ selectedProducts().length }})
//               </app-button>
//             }
//           </div>
//         </div>
//       </div>

//       <!-- Loading State -->
//       @if (loading()) {
//         <app-loading type="skeleton" message="Loading products..." />
//       }

//       <!-- Products Grid -->
//       @else if (products().length > 0) {
//         <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           @for (product of products(); track product._id) {
//             <div class="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
//               <!-- Product Image -->
//               <div class="relative">
//                 <img
//                   [src]="product.images[0] || '/assets/images/product-placeholder.jpg'"
//                   [alt]="product.name"
//                   class="w-full h-48 object-cover rounded-t-lg"
//                 >
//                 @if (product.discountPrice > 0) {
//                   <div class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
//                     -{{ product.basePrice | discountPercentage:product.discountPrice }}%
//                   </div>
//                 }
//                 <div class="absolute top-2 right-2">
//                   <input
//                     type="checkbox"
//                     [checked]="selectedProducts().includes(product._id!)"
//                     (change)="toggleProductSelection(product._id!, $event)"
//                     class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
//                   >
//                 </div>
//               </div>

//               <!-- Product Info -->
//               <div class="p-4">
//                 <h3 class="font-semibold text-gray-900 mb-1">
//                   {{ product.name | textTruncate:30 }}
//                 </h3>
//                 <p class="text-sm text-gray-600 mb-2">
//                   {{ product.description | textTruncate:60 }}
//                 </p>

//                 <!-- Price -->
//                 <div class="flex items-center space-x-2 mb-2">
//                   @if (product.discountPrice > 0) {
//                     <span class="text-lg font-bold text-red-600">
//                       {{ product.discountPrice | customCurrency }}
//                     </span>
//                     <span class="text-sm text-gray-500 line-through">
//                       {{ product.basePrice | customCurrency }}
//                     </span>
//                   } @else {
//                     <span class="text-lg font-bold text-gray-900">
//                       {{ product.basePrice | customCurrency }}
//                     </span>
//                   }
//                 </div>

//                 <!-- Stock Status -->
//                 @if (getProductStock(product) !== null) {
//                   <div class="mb-2">
//                     @let stockInfo = getProductStock(product)! | stockStatus;
//                     <span [class]="'inline-block px-2 py-1 rounded-full text-xs font-medium ' + stockInfo.class">
//                       {{ stockInfo.status }}
//                     </span>
//                   </div>
//                 }

//                 <!-- Rating -->
//                 @if (product.averageRating > 0) {
//                   <div class="flex items-center mb-2">
//                     <div class="flex text-yellow-400">
//                       @for (star of getStarArray(product.averageRating); track $index) {
//                         <svg class="w-4 h-4" [class]="star ? 'fill-current' : 'stroke-current fill-none'" viewBox="0 0 24 24">
//                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
//                         </svg>
//                       }
//                     </div>
//                     <span class="text-sm text-gray-600 ml-1">
//                       ({{ product.reviewCount }})
//                     </span>
//                   </div>
//                 }

//                 <!-- Actions -->
//                 <div class="flex space-x-2">
//                   <app-button
//                     variant="outline"
//                     size="sm"
//                     [fullWidth]="true"
//                     (onClick)="viewProduct(product._id!)"
//                   >
//                     View
//                   </app-button>
//                   <app-button
//                     variant="primary"
//                     size="sm"
//                     [fullWidth]="true"
//                     (onClick)="editProduct(product._id!)"
//                   >
//                     Edit
//                   </app-button>
//                   <app-button
//                     variant="danger"
//                     size="sm"
//                     (onClick)="showDeleteModal(product)"
//                   >
//                     <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
//                     </svg>
//                   </app-button>
//                 </div>
//               </div>
//             </div>
//           }
//         </div>

//         <!-- Pagination -->
//         <div class="mt-8 flex items-center justify-between">
//           <div class="text-sm text-gray-700">
//             Showing {{ (currentPage() - 1) * pageSize() + 1 }} to
//             {{ Math.min(currentPage() * pageSize(), totalProductsCount()) }} of
//             {{ totalProductsCount() }} results
//           </div>
//           <div class="flex space-x-2">
//             <app-button
//               variant="outline"
//               size="sm"
//               [disabled]="currentPage() === 1"
//               (onClick)="previousPage()"
//             >
//               Previous
//             </app-button>
//             @for (page of visiblePages(); track page) {
//               <app-button
//                 [variant]="page === currentPage() ? 'primary' : 'outline'"
//                 size="sm"
//                 (onClick)="goToPage(page)"
//               >
//                 {{ page }}
//               </app-button>
//             }
//             <app-button
//               variant="outline"
//               size="sm"
//               [disabled]="currentPage() === totalPages()"
//               (onClick)="nextPage()"
//             >
//               Next
//             </app-button>
//           </div>
//         </div>
//       }

//       <!-- Empty State -->
//       @else {
//         <div class="text-center py-12">
//           <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
//           </svg>
//           <h3 class="mt-4 text-lg font-medium text-gray-900">No products found</h3>
//           <p class="mt-2 text-gray-500">Get started by creating your first product.</p>
//           <div class="mt-6">
//             <app-button variant="primary" (onClick)="navigateToCreateProduct()">
//               Add Product
//             </app-button>
//           </div>
//         </div>
//       }
//     </div>


//   `
// })
// export class ProductListComponent implements OnInit, OnDestroy {
//   private readonly destroy$ = new Subject<void>();
//   private readonly productApiService = inject(ProductApiService);
//   private readonly productFilterService = inject(ProductFilterService);
//   private readonly router = inject(Router);

//   // Make Math available in template
//   protected readonly Math = Math;

//   // Signals
//   products = signal<Product[]>([]);
//   loading = signal(false);
//   deleteLoading = signal(false);
//   bulkDeleteLoading = signal(false);
//   selectedProducts = signal<string[]>([]);
//   productToDelete = signal<Product | null>(null);
//   currentPage = signal(1);
//   pageSize = signal(12);
//   totalProductsCount = signal(0);
//   filteredProductsCount = signal(0);
//   categories = signal<Array<{id: string, name: string}>>([]);

//   // Computed
//   totalPages = computed(() => Math.ceil(this.totalProductsCount() / this.pageSize()));
//   visiblePages = computed(() => {
//     const total = this.totalPages();
//     const current = this.currentPage();
//     const pages: number[] = [];

//     for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
//       pages.push(i);
//     }
//     return pages;
//   });

//   // Form properties
//   searchQuery = '';
//   selectedCategory = '';
//   selectedStatus = '';
//   showDeleteConfirmModal = false;
//   showBulkDeleteModal = false;

//   private searchSubject = new Subject<string>();

//   ngOnInit(): void {
//     this.loadProducts();
//     this.setupSearchDebounce();
//     this.loadCategories();
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }

//   private setupSearchDebounce(): void {
//     this.searchSubject
//       .pipe(
//         debounceTime(300),
//         distinctUntilChanged(),
//         takeUntil(this.destroy$)
//       )
//       .subscribe(query => {
//         this.currentPage.set(1);
//         this.loadProducts();
//       });
//   }

//   loadProducts(): void {
//     this.loading.set(true);

//     const params: ProductSearchParams = {
//       page: this.currentPage(),
//       limit: this.pageSize(),
//       query: this.searchQuery || undefined,
//       category: this.selectedCategory || undefined,
//       sortBy: 'createdAt',
//       sortOrder: 'desc'
//     };

//     // Add status-based filters
//     if (this.selectedStatus === 'on-discount') {
//       // Will be handled by API
//     }

//     this.productApiService.getProducts(params)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//       //   next: (response) => {
//       //     this.products.set(response.data);
//       //     // this.totalProductsCount.set(response.pagination.total);
//       //     this.totalProductsCount.set(response.pagination ? response.pagination.total : 0);

//       //     this.filteredProductsCount.set(response.data.length);
//       //     this.loading.set(false);
//       //   },
//       //   error: (error) => {
//       //     console.error('Error loading products:', error);
//       //     this.loading.set(false);
//       //   }
//       // }
//       next: (response) => {
//         this.products.set(Array.isArray(response.data) ? response.data : []);
//         this.totalProductsCount.set(response.pagination ? response.pagination.total : 0);
//         this.filteredProductsCount.set(Array.isArray(response.data) ? response.data.length : 0);
//         this.loading.set(false);
//       },}


//     );
//   }

//   private loadCategories(): void {
//     // This would typically come from a category service
//     this.categories.set([
//       { id: '1', name: 'Electronics' },
//       { id: '2', name: 'Clothing' },
//       { id: '3', name: 'Food & Beverages' },
//       { id: '4', name: 'Home & Garden' }
//     ]);
//   }

//   onSearchChange(query: string): void {
//     this.searchQuery = query;
//     this.searchSubject.next(query);
//   }

//   onCategoryChange(category: string): void {
//     this.selectedCategory = category;
//     this.currentPage.set(1);
//     this.loadProducts();
//   }

//   onStatusChange(status: string): void {
//     this.selectedStatus = status;
//     this.currentPage.set(1);
//     this.loadProducts();
//   }

//   resetFilters(): void {
//     this.searchQuery = '';
//     this.selectedCategory = '';
//     this.selectedStatus = '';
//     this.currentPage.set(1);
//     this.loadProducts();
//   }

//   toggleProductSelection(productId: string, event: any): void {
//     const selected = this.selectedProducts();
//     if (event.target.checked) {
//       this.selectedProducts.set([...selected, productId]);
//     } else {
//       this.selectedProducts.set(selected.filter(id => id !== productId));
//     }
//   }

//   navigateToCreateProduct(): void {
//     this.router.navigate(['/products/create']);
//   }

//   viewProduct(productId: string): void {
//     this.router.navigate(['/products', productId]);
//   }

//   editProduct(productId: string): void {
//     this.router.navigate(['/products', productId, 'edit']);
//   }

//   showDeleteModal(product: Product): void {
//     this.productToDelete.set(product);
//     this.showDeleteConfirmModal = true;
//   }

//   hideDeleteModal(): void {
//     this.productToDelete.set(null);
//     this.showDeleteConfirmModal = false;
//   }

//   confirmDelete(): void {
//     const product = this.productToDelete();
//     if (!product?._id) return;

//     this.deleteLoading.set(true);
//     this.productApiService.deleteProduct(product._id)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: () => {
//           this.hideDeleteModal();
//           this.deleteLoading.set(false);
//           this.loadProducts();
//         },
//         error: (error) => {
//           console.error('Error deleting product:', error);
//           this.deleteLoading.set(false);
//         }
//       });
//   }

//   confirmBulkDelete(): void {
//     const selectedIds = this.selectedProducts();
//     if (selectedIds.length === 0) return;

//     this.bulkDeleteLoading.set(true);
//     this.productApiService.bulkDeleteProducts(selectedIds)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: () => {
//           this.showBulkDeleteModal = false;
//           this.bulkDeleteLoading.set(false);
//           this.selectedProducts.set([]);
//           this.loadProducts();
//         },
//         error: (error) => {
//           console.error('Error bulk deleting products:', error);
//           this.bulkDeleteLoading.set(false);
//         }
//       });
//   }

//   getProductStock(product: Product): number | null {
//     if (product.variants.length === 0) return null;
//     return product.variants.reduce((total, variant) =>
//       total + variant.options.reduce((sum, option) => sum + option.stock, 0), 0
//     );
//   }

//   getStarArray(rating: number): boolean[] {
//     const stars: boolean[] = [];
//     for (let i = 1; i <= 5; i++) {
//       stars.push(i <= Math.floor(rating));
//     }
//     return stars;
//   }

//   // Pagination methods
//   previousPage(): void {
//     if (this.currentPage() > 1) {
//       this.currentPage.set(this.currentPage() - 1);
//       this.loadProducts();
//     }
//   }

//   nextPage(): void {
//     if (this.currentPage() < this.totalPages()) {
//       this.currentPage.set(this.currentPage() + 1);
//       this.loadProducts();
//     }
//   }

//   goToPage(page: number): void {
//     this.currentPage.set(page);
//     this.loadProducts();
//   }
// }


//*!

// import { Component, signal, inject } from '@angular/core';
// import { ProductApiService } from '../../services/product-api.service';
// import { Product } from '../../../../shared/models/product.interface.js';
// // import { Product } from 'src/app/shared/models/product.interface';

// @Component({
//   selector: 'app-product-list',
//   standalone: true,
//   imports: [],
//   templateUrl: './product-list.component.html',
// })
// export class ProductListComponent {
//   private productService = inject(ProductApiService);
//   readonly products = signal<Product[]>([]);

//   constructor() {
//     this.loadProducts();
//   }

//   private loadProducts() {
//     // this.productService.getProducts().subscribe((data) => {
//     //   this.products.set(data);
//     // });
//     this.productService.getProducts().subscribe((response) => {
//       this.products.set(response.data);
//     });
//   }
// }


//*!

// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
// import { ProductApiService } from '../../services/product-api.service';
// import { Product } from '../../../../shared/models/product.interface';

// @Component({
//   selector: 'app-product-list',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './product-list.component.html'
// })
// export class ProductListComponent implements OnInit {
//   products: Product[] = [];

//   constructor(
//     private productApiService: ProductApiService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.loadProducts();
//   }

//   loadProducts(): void {
//     this.productApiService.getProducts()
//       .subscribe({
//         next: (response) => {
//           this.products = response.data;
//         },
//         error: (error) => {
//           console.error('Error loading products:', error);
//         }
//       });
//   }

//   navigateToCreate(): void {
//     this.router.navigate(['/products/create']);
//   }

//   viewProduct(id: string): void {
//     this.router.navigate(['/products', id]);
//   }

//   editProduct(id: string): void {
//     this.router.navigate(['/products', id, 'edit']);
//   }

//   deleteProduct(id: string): void {
//     if (confirm('Are you sure you want to delete this product?')) {
//       this.productApiService.deleteProduct(id)
//         .subscribe({
//           next: () => {
//             this.loadProducts();
//           },
//           error: (error) => {
//             console.error('Error deleting product:', error);
//           }
//         });
//     }
//   }
// }
