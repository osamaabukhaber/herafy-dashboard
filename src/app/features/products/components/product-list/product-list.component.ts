
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  products = signal<Product[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.loading.set(true);
    this.error.set(null);
    this.productApi.getProducts().subscribe({
      next: (response: ProductListBackendResponse) => {
        this.products.set(response.products);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.error.set('Failed to load products. Please try again later.');
        this.loading.set(false);
      },
    });
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productApi.deleteProduct(id).subscribe({
        next: () => {
          this.products.update(currentProducts => currentProducts.filter(p => p._id !== id));
        },
        error: (err) => {
          console.error('Error deleting product:', err);
          this.error.set(`Failed to delete product ${id}.`);
          this.fetchProducts();
        },
      });
    }
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
      return total + (Array.isArray(variant.options) ? variant.options.reduce((sum: number, option: ProductVariantOption) => sum + (option.stock || 0), 0) : 0);
    }, 0);
  }

  getStockStatus(product: Product): string {
    const totalStock = this.getTotalStock(product);
    if (totalStock === 0) return 'Out of Stock';
    if (totalStock < 5) return 'Low Stock';
    return 'In Stock';
  }
}

