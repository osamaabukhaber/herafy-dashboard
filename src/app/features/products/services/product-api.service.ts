// src/app/services/product-api.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environment/environment.developemnt';
import { ProductListBackendResponse } from '../../../shared/models/Api Responses/productResponse';
import { Product } from '../../../shared/models/product.interface.js';
import { Category } from '../../../shared/models/category.interface.js';


@Injectable({
  providedIn: 'root'
})
export class ProductApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}/api/product`;


  getProducts(): Observable<ProductListBackendResponse> {
    return this.http.get<ProductListBackendResponse>(this.apiUrl);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

    // Create product - sends FormData (files + JSON fields)
    createProduct(formData: FormData): Observable<Product> {
      return this.http.post<Product>(`${this.apiUrl}`, formData);
    }

    // For now: fake stores list
  // GET /api/store
  getStores(): Observable<{ _id: string; name: string }[]> {
    // return this.http.get<{ _id: string; name: string }[]>(`${this.baseUrl}/store`);
    return of([
      { _id: '68906db92b1ddddcb879cee5', name: 'Tech Gear' },
      { _id: '68906db92b1ddddcb879cee7', name: 'Book Town' }
    ]);
  }

  // For now: fake categories.
  getCategories(): Observable<Category[]> {
    // return this.http.get<Category[]>(`${this.baseUrl}/category`);
    return of([
      { _id: '68895bd225e59a1915813ce4', name: 'rayzen', isActive: true, sortOrder: 1 },
      { _id: '6893b07e7718b30fbeb16997', name: 'Hand Made', isActive: true, sortOrder: 2 }
    ] as Category[]);
  }

}

// // / src/app/features/products/services/product-api.service.ts

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../../../environment/environment.developemnt.js';
// import { Product, ProductCreateRequest, ProductSearchParams, ProductUpdateRequest } from '../../../shared/models/product.interface.js';
// import { ApiResponse, PaginatedResponse } from '../../../shared/models/api-response.interface.js';
// // import { environment } from '../../../../environments/environment';
// // import { Product, ProductCreateRequest, ProductUpdateRequest, ProductSearchParams } from '../../../shared/models/product.interface';
// // import { ApiResponse, PaginatedResponse } from '../../../shared/models/api-response.interface';

// @Injectable({
//   providedIn: 'root'
// })
// export class ProductApiService {
//   private readonly apiUrl = `${environment.apiBaseUrl}/api/product`;

//   constructor(private http: HttpClient) {}

//   getProducts(params?: ProductSearchParams): Observable<PaginatedResponse<Product>> {
//     let httpParams = new HttpParams();

//     if (params) {
//       Object.keys(params).forEach(key => {
//         const value = params[key as keyof ProductSearchParams];
//         if (value !== undefined && value !== null && value !== '') {
//           httpParams = httpParams.set(key, value.toString());
//         }
//       });
//     }

//     return this.http.get<PaginatedResponse<Product>>(this.apiUrl, { params: httpParams });
//   }

//   getProductById(id: string): Observable<ApiResponse<Product>> {
//     return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/${id}`);
//   }

//   createProduct(product: ProductCreateRequest): Observable<ApiResponse<Product>> {
//     return this.http.post<ApiResponse<Product>>(this.apiUrl, product);
//   }

//   updateProduct(id: string, product: ProductUpdateRequest): Observable<ApiResponse<Product>> {
//     return this.http.patch<ApiResponse<Product>>(`${this.apiUrl}/${id}`, product);
//   }

//   deleteProduct(id: string): Observable<ApiResponse<void>> {
//     return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
//   }

//   searchProducts(query: string, filters?: Partial<ProductSearchParams>): Observable<PaginatedResponse<Product>> {
//     const params: ProductSearchParams = {
//       query,
//       ...filters
//     };
//     return this.getProducts(params);
//   }

//   uploadProductImage(file: File): Observable<ApiResponse<{ url: string }>> {
//     const formData = new FormData();
//     formData.append('image', file);
//     return this.http.post<ApiResponse<{ url: string }>>(`${this.apiUrl}/upload-image`, formData);
//   }

//   bulkDeleteProducts(ids: string[]): Observable<ApiResponse<void>> {
//     return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/bulk`, { body: { ids } });
//   }
// }
//*!
// import { inject, Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { ApiResponse } from '../../../shared/models/api-response.interface';
// import { environment } from '../../../environment/environment.developemnt.js';
// import { Product } from '../../../shared/models/product.interface.js';

// @Injectable({ providedIn: 'root' })
// export class ProductApiService {
//   private http = inject(HttpClient);
//   private apiUrl = `${environment.apiBaseUrl}/api/product`;

//   getAllProducts(page: number = 1, limit: number = 10): Observable<ApiResponse<Product[]>> {
//     const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());
//     return this.http.get<ApiResponse<Product[]>>(this.apiUrl, { params });
//   }

//   getProductById(id: string): Observable<Product> {
//     return this.http.get<Product>(`${this.apiUrl}/${id}`);
//   }

//   searchProducts(query: string): Observable<ApiResponse<Product[]>> {
//     const params = new HttpParams().set('query', query);
//     return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/search`, { params });
//   }

//   createProduct(product: Partial<Product>): Observable<Product> {
//     return this.http.post<Product>(this.apiUrl, product);
//   }

//   updateProduct(id: string, product: Partial<Product>): Observable<Product> {
//     return this.http.patch<Product>(`${this.apiUrl}/${id}`, product);
//   }

//   deleteProduct(id: string): Observable<void> {
//     return this.http.delete<void>(`${this.apiUrl}/${id}`);
//   }
// }
//*!

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../../../environment/environment.developemnt';
// import {
//   Product,
//   CreateProductRequest,
//   UpdateProductRequest,
//   ProductFilters,
//   ProductListResponse
// } from '../../../shared/models/product.interface';

// @Injectable({
//   providedIn: 'root'
// })
// export class ProductApiService {
//   private baseUrl = `${environment.apiBaseUrl}/api/product`;

//   constructor(private http: HttpClient) {}

//   /**
//    * GET /api/product
//    * Get all products with optional filtering
//    */
//   getAllProducts(filters?: ProductFilters): Observable<ProductListResponse> {
//     let params = new HttpParams();

//     if (filters) {
//       Object.keys(filters).forEach(key => {
//         const value = filters[key as keyof ProductFilters];
//         if (value !== undefined && value !== null) {
//           if (Array.isArray(value)) {
//             value.forEach(item => {
//               params = params.append(key, item.toString());
//             });
//           } else {
//             params = params.set(key, value.toString());
//           }
//         }
//       });
//     }

//     return this.http.get<ProductListResponse>(this.baseUrl, { params });
//   }

//   /**
//    * GET /api/product/:id
//    * Get product by ID
//    */
//   getProductById(id: string): Observable<Product> {
//     return this.http.get<Product>(`${this.baseUrl}/${id}`);
//   }

//   /**
//    * POST /api/product
//    * Create new product (Vendor/Admin only)
//    */
//   createProduct(productData: CreateProductRequest): Observable<Product> {
//     return this.http.post<Product>(this.baseUrl, productData);
//   }

//   /**
//    * PATCH /api/product/:id
//    * Update product (Owner/Admin only)
//    */
//   updateProduct(id: string, updateData: UpdateProductRequest): Observable<Product> {
//     return this.http.patch<Product>(`${this.baseUrl}/${id}`, updateData);
//   }

//   /**
//    * DELETE /api/product/:id
//    * Delete product (Owner/Admin only)
//    */
//   deleteProduct(id: string): Observable<{ message: string }> {
//     return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
//   }

//   /**
//    * GET /api/product/search
//    * Search products
//    */
//   searchProducts(query: string, filters?: ProductFilters): Observable<ProductListResponse> {
//     let params = new HttpParams().set('q', query);

//     if (filters) {
//       Object.keys(filters).forEach(key => {
//         const value = filters[key as keyof ProductFilters];
//         if (value !== undefined && value !== null) {
//           if (Array.isArray(value)) {
//             value.forEach(item => {
//               params = params.append(key, item.toString());
//             });
//           } else {
//             params = params.set(key, value.toString());
//           }
//         }
//       });
//     }

//     return this.http.get<ProductListResponse>(`${this.baseUrl}/search`, { params });
//   }

//   /**
//    * Get products by category
//    */
//   getProductsByCategory(categoryId: string, filters?: ProductFilters): Observable<ProductListResponse> {
//     const categoryFilters: ProductFilters = { ...filters, category: categoryId };
//     return this.getAllProducts(categoryFilters);
//   }

//   /**
//    * Get products by store
//    */
//   getProductsByStore(storeId: string, filters?: ProductFilters): Observable<ProductListResponse> {
//     const storeFilters: ProductFilters = { ...filters, store: storeId };
//     return this.getAllProducts(storeFilters);
//   }

//   /**
//    * Get products in stock
//    */
//   getProductsInStock(filters?: ProductFilters): Observable<ProductListResponse> {
//     const stockFilters: ProductFilters = { ...filters, inStock: true };
//     return this.getAllProducts(stockFilters);
//   }

//   /**
//    * Get active products
//    */
//   getActiveProducts(filters?: ProductFilters): Observable<ProductListResponse> {
//     const activeFilters: ProductFilters = { ...filters, isActive: true };
//     return this.getAllProducts(activeFilters);
//   }
// }
