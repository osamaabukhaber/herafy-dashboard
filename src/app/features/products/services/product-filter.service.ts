// src/app/features/products/services/product-filter.service.ts

// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
// import { Product, ProductFilterState } from '../../../shared/models/product.interface';

// @Injectable({
//   providedIn: 'root'
// })
// export class ProductFilterService {
//   private filterState = new BehaviorSubject<ProductFilterState>({
//     search: '',
//     category: '',
//     store: '',
//     priceRange: { min: 0, max: 10000 },
//     inStock: false,
//     onDiscount: false
//   });

//   private products = new BehaviorSubject<Product[]>([]);

//   readonly currentFilters$ = this.filterState.asObservable();
//   readonly filteredProducts$: Observable<Product[]> = combineLatest([
//     this.products,
//     this.filterState
//   ]).pipe(
//     map(([products, filters]) => this.applyFilters(products, filters))
//   );

//   setProducts(products: Product[]): void {
//     this.products.next(products);
//   }

//   updateFilter(filterUpdate: Partial<ProductFilterState>): void {
//     const currentFilters = this.filterState.value;
//     this.filterState.next({ ...currentFilters, ...filterUpdate });
//   }

//   resetFilters(): void {
//     this.filterState.next({
//       search: '',
//       category: '',
//       store: '',
//       priceRange: { min: 0, max: 10000 },
//       inStock: false,
//       onDiscount: false
//     });
//   }

//   private applyFilters(products: Product[], filters: ProductFilterState): Product[] {
//     return products.filter(product => {
//       // Search filter
//       if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase()) &&
//           !product.description.toLowerCase().includes(filters.search.toLowerCase())) {
//         return false;
//       }

//       // Category filter
//       if (filters.category && product.category !== filters.category) {
//         return false;
//       }

//       // Store filter
//       if (filters.store && product.store !== filters.store) {
//         return false;
//       }

//       // Price range filter
//       const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.basePrice;
//       if (effectivePrice < filters.priceRange.min || effectivePrice > filters.priceRange.max) {
//         return false;
//       }

//       // Stock filter
//       if (filters.inStock) {
//         const totalStock = product.variants.reduce((sum, variant) =>
//           sum + variant.options.reduce((optSum, option) => optSum + option.stock, 0), 0
//         );
//         if (totalStock === 0) return false;
//       }

//       // Discount filter
//       if (filters.onDiscount && product.discountPrice <= 0) {
//         return false;
//       }

//       return true;
//     });
//   }

//   getFilterSummary(): Observable<{
//     totalProducts: number;
//     filteredCount: number;
//     activeFiltersCount: number
//   }> {
//     return combineLatest([
//       this.products,
//       this.filteredProducts$,
//       this.filterState
//     ]).pipe(
//       map(([allProducts, filteredProducts, filters]) => ({
//         totalProducts: allProducts.length,
//         filteredCount: filteredProducts.length,
//         activeFiltersCount: this.countActiveFilters(filters)
//       }))
//     );
//   }

//   private countActiveFilters(filters: ProductFilterState): number {
//     let count = 0;
//     if (filters.search) count++;
//     if (filters.category) count++;
//     if (filters.store) count++;
//     if (filters.priceRange.min > 0 || filters.priceRange.max < 10000) count++;
//     if (filters.inStock) count++;
//     if (filters.onDiscount) count++;
//     return count;
//   }
// }


//*!

// import { Injectable, signal } from '@angular/core';
// import { Product } from '../../../shared/models/product.interface.js';
// // import { Product } from '../models/product.interface';

// @Injectable({ providedIn: 'root' })
// export class ProductFilterService {
//   searchTerm = signal<string>('');

//   updateSearchTerm(term: string) {
//     this.searchTerm.set(term);
//   }

//   filterProducts(products: Product[], term: string): Product[] {
//     if (!term) return products;
//     return products.filter(product =>
//       product.name.toLowerCase().includes(term.toLowerCase()) ||
//       product.description.toLowerCase().includes(term.toLowerCase())
//     );
//   }
// }
