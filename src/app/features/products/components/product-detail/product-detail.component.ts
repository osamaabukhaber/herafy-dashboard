import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductApiService } from '../../services/product-api.service';
import { Product } from '../../../../shared/models/product.interface.js';
import { Category } from '../../../../shared/models/category.interface';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  stores: { _id: string; name: string }[] = [];
  categories: Category[] = [];
  loading = false;

  constructor(
    private productApiService: ProductApiService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loading = true;
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      // Load stores and categories
      forkJoin([
        this.productApiService.getStores(),
        this.productApiService.getCategories(),
      ]).subscribe({
        next: ([stores, categories]) => {
          this.stores = stores;
          this.categories = categories;
          this.loadProduct(productId); 
        },
        error: (err) => console.error('Error loading stores or categories:', err),
      });

      // Load product
      this.loadProduct(productId);
    }
  }

  loadProduct(id: string): void {
    this.productApiService.getProductById(id).subscribe({
      next: (response) => {
        console.log('Product API response:', response);
        console.log('Categories:', this.categories);
      console.log('Stores:', this.stores);
        if (typeof response.category === 'string') {
          const category = this.categories.find(c => c._id === response.category) || {
            _id: response.category,
            name: 'غير مصنف',
          };
          this.product = { ...response, category };
        } else {
          this.product = response;
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  getDiscountPercentage(): number {
    if (!this.product || !this.product.basePrice || !this.product.discountPrice) return 0;
    return Math.round(((this.product.basePrice - this.product.discountPrice) / this.product.basePrice) * 100);
  }

  getStoreName(): string {
    return this.stores.find(s => s._id === this.product?.store)?.name || 'unknown category';
  }

  editProduct(): void {
    if (this.product) {
      this.router.navigate(['/products', this.product._id, 'edit']);
    }
  }

  deleteProduct(): void {
    if (this.product?._id && confirm('confirm delete')) {
      this.productApiService.deleteProduct(this.product._id).subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error deleting product:', error);
        },
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }
}
