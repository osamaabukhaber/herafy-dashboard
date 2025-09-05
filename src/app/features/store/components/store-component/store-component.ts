import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { IStore } from '../../../../models/store-model/istore';
import { StoreServices } from '../../services/store-serivces/store-services';
import {
  MapPin,
  Eye,
  Edit3,
  Trash2,
  Plus,
  Download,
  Search,
  Package,
  Heart,
  ShoppingCart,
  Percent,
  FileText,
  XCircle,
  Loader2,
  LucideAngularModule,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  ArrowUp,
  ArrowDown
} from 'lucide-angular';
import { StoreApiResponse } from '../../../../models/store-model/store-api-response';

export interface StoreStats {
  approvedStores: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}
@Component({
  selector: 'app-store-component',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './store-component.html',
  styleUrls: ['./store-component.css'],
})
export class StoreComponent implements OnInit, OnDestroy {
  storesList: IStore[] = [];
  selectedStore: IStore | null = null;

  error: string | null = null;
  loading = true;
  isLoading = false;
  showStoreModal = false;

  searchTerm = '';
  statusFilter = '';
  sortBy = 'name'; // backend supports: name, products, orders, oldest
  sortOrder: 'asc' | 'desc' = 'asc';
  private searchSubject = new Subject<string>();

  MapPin = MapPin;
  Eye = Eye;
  Edit3 = Edit3;
  Trash2 = Trash2;
  Plus = Plus;
  Download = Download;
  Search = Search;
  Package = Package;
  Heart = Heart;
  ShoppingCart = ShoppingCart;
  Percent = Percent;
  FileText = FileText;
  XCircle = XCircle;
  Loader2 = Loader2;
  ChevronRight = ChevronRight;
  ChevronLeft = ChevronLeft;
  RefreshCw = RefreshCw;
  ArrowUp = ArrowUp;
  ArrowDown = ArrowDown;

  currentPage = 1;
  pageSize = 10;
  totalStores = 0;
  totalPages = 0;

  stats: StoreStats = {
    approvedStores: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  };

  Math = Math;
  private destroy$ = new Subject<void>();

  constructor(
    private storeApiService: StoreServices,
    private route: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadStores();
    this.setupSearchDebounce();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ===== Load stores from backend =====
  loadStores(): void {
    this.loading = true;
    this.error = null;

    this.storeApiService
      .getAllStores({
        page: this.currentPage,
        limit: this.pageSize,
        search: this.searchTerm || undefined,
        status: this.statusFilter || undefined,
        sort: this.sortBy, // backend interprets this
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: StoreApiResponse) => {
          this.storesList = res.data.stores;
          this.totalStores = res.pagination.total;
          this.totalPages = res.pagination.totalPages;
          this.currentPage = res.pagination.currentPage;

          this.calculateStats();
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = err?.error?.message || 'Failed to load stores.';
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }

  // ===== Search with debounce =====
  private setupSearchDebounce(): void {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentPage = 1;
        this.loadStores();
      });
  }

  onSearch(): void {
    this.searchSubject.next(this.searchTerm);
  }

  // ===== Filter & Pagination =====
  onFilterChange(): void {
    this.currentPage = 1;
    this.loadStores();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadStores();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPages - 1);
    if (endPage - startPage < maxPages - 1) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  // ===== Stats =====
  calculateStats(): void {
    this.stats = {
      approvedStores: this.storesList.filter(
        (store) => store.status === 'approved' && !store.isDeleted
      ).length,
      totalProducts: this.storesList.reduce(
        (sum, store) => sum + (store.productCount || 0),
        0
      ),
      totalOrders: this.storesList.reduce(
        (sum, store) => sum + (store.ordersCount || 0),
        0
      ),
      totalRevenue: this.storesList.reduce(
        (sum, store) => sum + (store.ordersCount || 0) * 50,
        0
      ),
    };
  }

  // ===== Store actions =====
  viewStore(store: IStore): void {
    this.route.navigate(['/view-store', store._id]);
  }

  closeStoreModal(): void {
    this.showStoreModal = false;
    this.selectedStore = null;
  }

  deleteStore(id: string): void {
    if (!id) return;

    if (confirm('Are you sure you want to delete this store? This action cannot be undone.')) {
      this.isLoading = true;
      this.storeApiService
        .deleteStore(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.storesList = this.storesList.filter((s) => s._id !== id);
            this.calculateStats();
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: (err: any) => {
            this.error = err?.error?.message || 'Failed to delete store.';
            this.isLoading = false;
            this.cdr.detectChanges();
          },
        });
    }
  }

  addStore(): void {
    this.route.navigate(['/add-new-store']);
  }

  updateStore(store: IStore): void {
    if (store._id) {
      this.route.navigate(['/update-store', store._id]);
    }
  }

  // ===== Helpers =====
  getApprovedStoresCount(): number {
    return this.stats.approvedStores;
  }

  getTotalProducts(): number {
    return this.stats.totalProducts;
  }

  getTotalOrders(): number {
    return this.stats.totalOrders;
  }

  getTotalRevenue(): string {
    return this.formatCurrency(this.stats.totalRevenue);
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  getStoreAddress(store: IStore): string {
    return `${store.address.street}, ${store.address.city}, ${store.address.postalCode}`;
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  }

  getStatusIconClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-emerald-400';
      case 'pending':
        return 'bg-yellow-400';
      case 'inactive':
        return 'bg-red-400';
      default:
        return 'bg-slate-400';
    }
  }

  refreshStores(): void {
    this.loadStores();
  }

  exportStoresData(): void {
    const csvContent = this.convertToCSV(this.storesList);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stores-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private convertToCSV(stores: IStore[]): string {
    const headers = [
      'ID',
      'Name',
      'Description',
      'Status',
      'City',
      'Postal Code',
      'Street',
      'Products',
      'Orders',
      'Categories',
      'Coupons',
    ];
    const rows = stores.map((s) => [
      s._id || '',
      s.name,
      s.description,
      s.status,
      s.address.city,
      s.address.postalCode,
      s.address.street,
      s.productCount || 0,
      s.ordersCount || 0,
      s.categorieCount || 0,
      s.couponsUsed || 0,
    ]);
    return [headers, ...rows]
      .map((row) => row.map((field) => `"${field}"`).join(','))
      .join('\n');
  }

  trackByStoreId(index: number, store: IStore): string | undefined {
    return store._id;
  }
}
