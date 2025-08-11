import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { IStore } from '../../../../models/store-model/istore';
import { StoreServices } from '../../services/store-serivces/store-services';

export interface StoreFilters {
  status: string;
  search: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface StoreStats {
  activeStores: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

@Component({
  selector: 'app-store-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './store-component.html',
  styleUrl: './store-component.css'
})
export class StoreComponent implements OnInit, OnDestroy {
  // Data properties
  storesList: IStore[] = [];
  filteredStoresList: IStore[] = [];
  selectedStore: IStore | null = null;

  // State properties
  error: string | null = null;
  loading = true;
  isLoading = false;
  showStoreModal = false;

  // Search and filter properties
  searchTerm = '';
  statusFilter = '';
  sortBy = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';
  private searchSubject = new Subject<string>();

  // Pagination properties
  currentPage = 1;
  pageSize = 10;
  totalStores = 0;
  totalPages = 0;
  startIndex = 0;

  // Statistics
  stats: StoreStats = {
    activeStores: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  };

  // Expose Math to template
  Math = Math;

  private destroy$ = new Subject<void>();

  constructor(
    private storeApiService: StoreServices,
    private route: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadStores();
    this.setupSearchDebounce();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Load stores from API
  loadStores(): void {
    this.loading = true;
    this.error = null;

  this.storeApiService.getAllStores()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.storesList = res.data.stores;
          console.log(this.storesList) ;
          this.applyFilters();
          this.calculateStats();
          this.updatePagination();
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

  // Setup search debounce
  private setupSearchDebounce(): void {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.currentPage = 1;
        this.applyFilters();
      });
  }

  // Search functionality
  onSearch(): void {
    this.searchSubject.next(this.searchTerm);
  }

  // Filter functionality
  onFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  // Apply filters and search
  applyFilters(): void {
    let filtered = [...this.storesList];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(store =>
        store.name.toLowerCase().includes(searchLower) ||
        store.description.toLowerCase().includes(searchLower) ||
        store.address.city.toLowerCase().includes(searchLower) ||
        store._id?.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (this.statusFilter) {
      filtered = filtered.filter(store => store.status === this.statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (this.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'city':
          aValue = a.address.city.toLowerCase();
          bValue = b.address.city.toLowerCase();
          break;
        case 'products':
          aValue = a.productCount || 0;
          bValue = b.productCount || 0;
          break;
        case 'orders':
          aValue = a.ordersCount || 0;
          bValue = b.ordersCount || 0;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return this.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    this.filteredStoresList = filtered;
    this.updatePagination();
  }

  // Calculate statistics
  calculateStats(): void {
    this.stats = {
      activeStores: this.storesList.filter(store => store.status === 'active' && !store.isDeleted).length,
      totalProducts: this.storesList.reduce((sum, store) => sum + (store.productCount || 0), 0),
      totalOrders: this.storesList.reduce((sum, store) => sum + (store.ordersCount || 0), 0),
      totalRevenue: this.storesList.reduce((sum, store) => {
        // Estimate revenue based on orders (you might want to get actual revenue from API)
        return sum + ((store.ordersCount || 0) * 50); // Assuming average order value of $50
      }, 0)
    };
  }

  // Pagination methods
  updatePagination(): void {
    this.totalStores = this.filteredStoresList.length;
    this.totalPages = Math.ceil(this.totalStores / this.pageSize);
    this.startIndex = (this.currentPage - 1) * this.pageSize;

    // Get current page data
    const start = this.startIndex;
    const end = start + this.pageSize;
    this.filteredStoresList = this.filteredStoresList.slice(start, end);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = 5; // Show max 5 page numbers

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

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.applyFilters();
    }
  }

  // Modal methods
  viewStore(store: IStore): void {
    this.route.navigate(["/view-store", store._id]);
  }

  closeStoreModal(): void {
    this.showStoreModal = false;
    this.selectedStore = null;
  }

  // Store management methods
  deleteStore(id: string): void {
    if (!id) return;

    if (confirm('Are you sure you want to delete this store? This action cannot be undone.')) {
      this.isLoading = true;

      this.storeApiService.deleteStore(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            // Remove store from local list
            this.storesList = this.storesList.filter(store => store._id !== id);
            this.applyFilters();
            this.calculateStats();
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: (err:any) => {
            this.error = err?.error?.message || 'Failed to delete store.';
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        });
    }
  }

  addStore(): void {
    this.route.navigate(["/add-new-store"]);
  }

  updateStore(store: IStore): void {
    if (store._id) {
      this.route.navigate(["/update-store", store._id]);
    }
  }

  // Utility methods for template
  getActiveStoresCount(): number {
    return this.stats.activeStores;
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
      maximumFractionDigits: 0
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

  // Refresh data
  refreshStores(): void {
    this.loadStores();
  }

  // Export functionality
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
    const headers = ['ID', 'Name', 'Description', 'Status', 'City', 'Postal Code', 'Street', 'Products', 'Orders', 'Categories', 'Coupons'];
    const rows = stores.map(store => [
      store._id || '',
      store.name,
      store.description,
      store.status,
      store.address.city,
      store.address.postalCode,
      store.address.street,
      store.productCount || 0,
      store.ordersCount || 0,
      store.categorieCount || 0,
      store.couponsUsed || 0
    ]);

    return [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
  }
}
