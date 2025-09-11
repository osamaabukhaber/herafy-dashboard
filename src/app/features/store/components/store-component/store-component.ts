import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, finalize } from 'rxjs';
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
  sortBy = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';
  private searchSubject = new Subject<string>();

  // Lucide Icons
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
  private lastRefreshTime = 0;
  private readonly REFRESH_COOLDOWN = 2000; // 2 seconds cooldown

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

  // ===== Enhanced Load stores from backend =====
  loadStores(): void {
    this.loading = true;
    this.error = null;

    this.storeApiService
      .getAllStores({
        page: this.currentPage,
        limit: this.pageSize,
        search: this.searchTerm || undefined,
        status: this.statusFilter || undefined,
        sort: this.sortBy,
      })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (res: StoreApiResponse) => {
          this.storesList = res.data.stores;
          this.totalStores = res.pagination.total;
          this.totalPages = res.pagination.totalPages;
          this.currentPage = res.pagination.currentPage;

          this.calculateStats();
          this.error = null;
        },
        error: (err) => {
          this.error = this.getErrorMessage(err);
          this.storesList = [];
          this.totalStores = 0;
          this.totalPages = 0;
        },
      });
  }

  // ===== Enhanced Refresh functionality =====
  refreshStores(): void {
    const now = Date.now();

    // Prevent spam refreshing
    if (now - this.lastRefreshTime < this.REFRESH_COOLDOWN) {
      return;
    }

    this.lastRefreshTime = now;

    // If not initially loading, show the loading overlay
    if (!this.loading) {
      this.isLoading = true;
    }

    this.error = null;
    this.loadStores();
  }

  // ===== Search with debounce =====
  private setupSearchDebounce(): void {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.currentPage = 1;
        this.loadStores();
      });
  }

  onSearch(): void {
    this.searchSubject.next(this.searchTerm);
  }

  // ===== Enhanced Filter & Pagination =====
  onFilterChange(): void {
    this.currentPage = 1;
    this.loadStores();
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.onFilterChange();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage && !this.isLoading) {
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

  // ===== Enhanced Stats calculation =====
  calculateStats(): void {
    const activeStores = this.storesList.filter(
      (store) => store.status === 'approved' && !store.isDeleted
    );

    this.stats = {
      approvedStores: activeStores.length,
      totalProducts: this.storesList.reduce(
        (sum, store) => sum + (store.productCount || 0),
        0
      ),
      totalOrders: this.storesList.reduce(
        (sum, store) => sum + (store.ordersCount || 0),
        0
      ),
      totalRevenue: this.storesList.reduce(
        (sum, store) => sum + (store.ordersCount || 0) * 50, // Assuming $50 per order
        0
      ),
    };
  }

  // ===== Enhanced Store actions =====
  viewStore(store: IStore): void {
    if (!this.isLoading && store._id) {
      this.route.navigate(['/view-store', store._id]);
    }
  }

  updateStore(store: IStore): void {
    if (!this.isLoading && store._id) {
      this.route.navigate(['/update-store', store._id]);
    }
  }

  addStore(): void {
    if (!this.isLoading) {
      this.route.navigate(['/add-new-store']);
    }
  }

  deleteStore(id: string): void {
    if (!id || this.isLoading) return;

    const confirmMessage = 'Are you sure you want to delete this store? This action cannot be undone.';

    if (confirm(confirmMessage)) {
      this.isLoading = true;

      this.storeApiService
        .deleteStore(id)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => {
            this.isLoading = false;
            this.cdr.detectChanges();
          })
        )
        .subscribe({
          next: () => {
            this.storesList = this.storesList.filter((s) => s._id !== id);
            this.totalStores = Math.max(0, this.totalStores - 1);
            this.calculateStats();
            this.updatePaginationAfterDelete();
          },
          error: (err: any) => {
            this.error = this.getErrorMessage(err, 'Failed to delete store.');
          },
        });
    }
  }

  // ===== Enhanced Helper methods =====
  private updatePaginationAfterDelete(): void {
    // Recalculate total pages
    this.totalPages = Math.ceil(this.totalStores / this.pageSize);

    // If current page is now beyond available pages, go to last page
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
      this.loadStores();
    }
  }

  private getErrorMessage(err: any, fallback: string = 'Failed to load stores.'): string {
    if (err?.error?.message) {
      return err.error.message;
    }
    if (err?.message) {
      return err.message;
    }
    if (typeof err === 'string') {
      return err;
    }
    return fallback;
  }

  clearError(): void {
    this.error = null;
  }

  closeStoreModal(): void {
    this.showStoreModal = false;
    this.selectedStore = null;
  }

  // ===== Stats getters =====
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

  // ===== Enhanced utility methods =====
  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  getStoreAddress(store: IStore): string {
    const parts = [
      store.address?.street,
      store.address?.city,
      store.address?.postalCode
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(', ') : 'No address provided';
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'approved': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'active': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'rejected': 'bg-red-100 text-red-800 border-red-200',
      'suspended': 'bg-orange-100 text-orange-800 border-orange-200',
      'inactive': 'bg-slate-100 text-slate-800 border-slate-200',
    };

    return statusMap[status?.toLowerCase()] || 'bg-slate-100 text-slate-800 border-slate-200';
  }

  getStatusIconClass(status: string): string {
    const statusIconMap: { [key: string]: string } = {
      'approved': 'bg-emerald-400',
      'active': 'bg-emerald-400',
      'pending': 'bg-yellow-400',
      'rejected': 'bg-red-400',
      'suspended': 'bg-orange-400',
      'inactive': 'bg-slate-400',
    };

    return statusIconMap[status?.toLowerCase()] || 'bg-slate-400';
  }

  // ===== Enhanced Export functionality =====
  exportStoresData(): void {
    if (this.storesList.length === 0) {
      alert('No data to export.');
      return;
    }

    try {
      const csvContent = this.convertToCSV(this.storesList);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = `stores-export-${new Date().toISOString().split('T')[0]}.csv`;
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    }
  }

  private convertToCSV(stores: IStore[]): string {
    const headers = [
      'ID',
      'Name',
      'Description',
      'Status',
      'Owner',
      'Street',
      'City',
      'Postal Code',
      'Latitude',
      'Longitude',
      'Products',
      'Orders',
      'Categories',
      'Coupons Used',
      'Shipping Policy',
      'Return Policy',
      'Created Date',
      'Is Deleted'
    ];

    const rows = stores.map((store) => [
      `"${store._id || ''}"`,
      `"${store.name || ''}"`,
      `"${(store.description || '').replace(/"/g, '""')}"`,
      `"${store.status || ''}"`,
      `"${store.owner || ''}"`,
      `"${store.address?.street || ''}"`,
      `"${store.address?.city || ''}"`,
      `"${store.address?.postalCode || ''}"`,
      `"${store.location?.coordinates?.[1] || ''}"`,
      `"${store.location?.coordinates?.[0] || ''}"`,
      `"${store.productCount || 0}"`,
      `"${store.ordersCount || 0}"`,
      `"${store.categorieCount || 0}"`,
      `"${store.couponsUsed || 0}"`,
      `"${(store.policies?.shipping || '').replace(/"/g, '""')}"`,
      `"${(store.policies?.returns || '').replace(/"/g, '""')}"`,
      `"${store.createdAt ? new Date(store.createdAt).toLocaleDateString() : ''}"`,
      `"${store.isDeleted ? 'Yes' : 'No'}"`
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  // ===== Enhanced TrackBy function =====
  trackByStoreId(index: number, store: IStore): string {
    return store._id || `store-${index}`;
  }

  // ===== Utility methods for template =====
  isRefreshDisabled(): boolean {
    return this.loading || this.isLoading;
  }

  isActionDisabled(): boolean {
    return this.loading || this.isLoading;
  }

  getRefreshButtonText(): string {
    if (this.loading) return 'Loading...';
    if (this.isLoading) return 'Refreshing...';
    return 'Refresh';
  }
}
