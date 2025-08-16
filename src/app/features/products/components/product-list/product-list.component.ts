
import { ChangeDetectorRef, Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductApiService } from '../../services/product-api.service';
import { Product, ProductVariant, ProductVariantOption } from '../../../../shared/models/product.interface';
import { ProductListBackendResponse } from '../../../../shared/models/Api Responses/productResponse';
import { CustomCurrencyPipe } from '../../../../shared/pipes/currency.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, CustomCurrencyPipe, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  private productApi = inject(ProductApiService);
  private cdr = inject(ChangeDetectorRef);
  products = signal<Product[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  //* for pagination and filter
  currentPage = signal(1);
  totalPages = signal(1);
  selectedStatus = signal<string>('');
  limit = 10;

  ngOnInit() {
    this.fetchProducts();
  }
  statusCounts = signal<Record<string, number>>({ all: 0, approved: 0, pending: 0, rejected: 0 });

  // derived counts
  totalOrders = computed(() => this.products().length);
  approvedCount = computed(() => this.products().filter(p => (p as any).status === 'approved').length);
  pendingCount = computed(() => this.products().filter(p => (p as any).status === 'pending').length);
  rejectedCount = computed(() => this.products().filter(p => (p as any).status === 'rejected').length);

// totalOrders   = computed(() => this.statusCounts()['all'] ?? 0);
// approvedCount = computed(() => this.statusCounts()['approved'] ?? 0);
// pendingCount  = computed(() => this.statusCounts()['pending'] ?? 0);
// rejectedCount = computed(() => this.statusCounts()['rejected'] ?? 0);


// fetch paginated products **and** read counts from response (preferred)
  // fetchProducts(): void {
  //   this.loading.set(true);
  //   this.error.set(null);

  //   this.productApi.getProducts({
  //     page: this.currentPage(),
  //     limit: this.limit,
  //     status: this.selectedStatus()
  //   }).subscribe({
  //     next: (response) => {
  //       // response.products (current page)
  //       this.products.set(response.products ?? []);
  //       this.totalPages.set(response.totalPages ?? 1);

  //       // NOTE: handle multiple possible shapes for counts:
  //       // 1) response.counts = [{ _id: 'approved', count: 123 }, ...]
  //       // 2) response.counts = { all: 200, approved: 120, ... }
  //       const countsRaw = (response as any).counts;
  //       if (Array.isArray(countsRaw)) {
  //         const map: Record<string, number> = { all: 0, approved: 0, pending: 0, rejected: 0 };
  //         countsRaw.forEach((c: any) => {
  //           const key = (c._id ?? c.status ?? '').toString();
  //           const val = Number(c.count ?? 0);
  //           if (key === '' || key.toLowerCase() === 'all') { map['all'] = val; }
  //           else { map[key] = val; }
  //         });
  //         // If backend didn't return total "all", compute fallback as sum
  //         if (!map['all']) {
  //           map['all'] = Object.values(map).reduce((s, v) => s + v, 0);
  //         }
  //         this.statusCounts.set(map);
  //       } else if (countsRaw && typeof countsRaw === 'object') {
  //         // object shape
  //         const map: Record<string, number> = {
  //           all: Number(countsRaw.all ?? 0),
  //           approved: Number(countsRaw.approved ?? 0),
  //           pending: Number(countsRaw.pending ?? 0),
  //           rejected: Number(countsRaw.rejected ?? 0)
  //         };
  //         if (!map['all']) {
  //           map['all'] = Object.values(map).reduce((s, v) => s + v, 0);
  //         }
  //         this.statusCounts.set(map);
  //       } else {
  //         // fallback: compute counts from server-provided products (only if no counts provided)
  //         const fallback: Record<string, number> = { all: 0, approved: 0, pending: 0, rejected: 0 };
  //         const products = response.products ?? [];
  //         products.forEach((p: any) => {
  //           const st = (p.status ?? '').toString().toLowerCase();
  //           if (st in fallback) fallback[st] = fallback[st] + 1;
  //           fallback['all']++;
  //         });
  //         this.statusCounts.set(fallback);
  //       }

  //       this.loading.set(false);
  //     },
  //     error: (err) => {
  //       console.error('Error loading products:', err);
  //       this.error.set('Failed to load products. Please try again later.');
  //       this.loading.set(false);
  //     }
  //   });
  // }

  // when user clicks a card to filter
  onStatusFilterChange(status: string) {
    // set selectedStatus and reload page 1
    this.selectedStatus.set(status);
    this.currentPage.set(1);
    this.fetchProducts();
  }



  fetchProducts(): void {
    this.loading.set(true);
    this.error.set(null);
    this.productApi.getProducts({
      page: this.currentPage(),
      limit: this.limit,
      status: this.selectedStatus()
    }).subscribe({
      next: (response) => {
        this.products.set(response.products);
        this.totalPages.set(response.totalPages);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.error.set('Failed to load products. Please try again later.');
        this.loading.set(false);
      },
    });
  }

  // onStatusFilterChange(status: string) {
  //   this.selectedStatus.set(status);
  //   this.currentPage.set(1);
  //   this.fetchProducts();
  // }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.fetchProducts();
    }
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

  getStockStatusClass(status: string): string {
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

  onStatusChange(status: string, productId: string) {
    this.productApi.updateProductStatus(productId, status).subscribe({
      next: () => console.log('Status updated!'),
      error: (err) => console.error('Failed to update status', err),

    });
    this.cdr.detectChanges();
  }

}

