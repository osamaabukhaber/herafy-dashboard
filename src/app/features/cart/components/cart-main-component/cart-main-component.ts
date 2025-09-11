import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CartService } from '../../services/cart-service';
import { ICart } from '../../../../models/cart-model/icart';
import { IUser } from '../../../../models/iuser';
import { Product } from '../../../../shared/models/product.interface';
import { ICoupon } from '../../../../shared/models/coupon.interface';
import { IcartResponceApi } from '../../../../models/cart-model/icart-responce-api';

interface ICartWithSelection extends ICart {
  selected?: boolean;
}

interface StatCard {
  label: string;
  value: string;
  bgClass: string;
  iconClass: string;
  iconPath: string;
}

@Component({
  selector: 'app-cart-main-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './cart-main-component.html',
  styleUrl: './cart-main-component.css'
})
export class CartMainComponent implements OnInit {
  /** Data */
  cartList: ICartWithSelection[] = [];
  users: IUser[] = [];
  products: Product[] = [];
  coupons: ICoupon[] = [];

  /** Loading States */
  isLoading = false;
  isRefreshing = false;

  /** Modal states */
  showCartModal = false;
  showViewModal = false;
  showDeleteModal = false;
  isEditMode = false;

  /** Selected carts */
  selectedCart: ICart | null = null;
  cartToDelete: ICart | null = null;

  /** Filters & sorting */
  searchTerm = '';
  selectedStatus = '';
  sortBy = 'createdAt';
  readonly slectedStatusOption = ['All Status', 'Active', 'Deleted'];
  readonly allowedSortFields = ['createdAt', 'updatedAt', 'total', 'discount', 'totalAfterDiscount'];

  /** Pagination */
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  totalCarts = 0;

  /** Selection */
  selectAll = false;

  /** Stats */
  totalValue = 0;
  activeCarts = 0;
  avgCartValue = 0;

  /** Utility */
  Math = Math;

  constructor(
    private cartApiService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCarts();
  }

  /** ===== Data Fetching ===== */
  private loadCarts(showLoading: boolean = true): void {
    if (showLoading) {
      this.isLoading = true;
    }

    const queryParams: any = {};

    // Add search term if exists
    if (this.searchTerm.trim()) {
      queryParams.search = this.searchTerm.trim();
    }

    // Add status filter if selected
    if (this.selectedStatus && this.selectedStatus !== 'All Status') {
      queryParams.status = this.selectedStatus.toLowerCase();
    }

    // Add timestamp to prevent caching
    queryParams._t = Date.now();

    this.cartApiService.getAllCarts({
      queryParams,
      sortBy: this.sortBy,
      page: this.currentPage,
      limit: this.pageSize
    }).subscribe({
      next: (response: IcartResponceApi) => {
        if (response.status === 'success') {
          this.cartList = response.data.carts.map(cart => ({ ...cart, selected: false }));
          this.totalCarts = response.pagination.total;
          this.totalPages = response.pagination.totalPages;
          this.currentPage = response.pagination.currentPage;

          console.log('Fetched cart items:', this.cartList);
          this.updateStats();
        } else {
          console.error('Failed to fetch cart items');
        }
      },
      error: (error) => {
        console.error('Error fetching cart items:', error);
      },
      complete: () => {
        this.isLoading = false;
        this.isRefreshing = false;
        this.cdr.detectChanges();
      }
    });
  }

  /** ===== Refresh Functionality ===== */
  refreshCarts(): void {
    this.isRefreshing = true;
    this.clearSelection(); // Clear any selections on refresh
    
    // Add a small delay for better UX (showing the spinning animation)
    setTimeout(() => {
      this.loadCarts(false); // Don't show main loading skeleton during refresh
    }, 500);
  }

  /** ===== Stats ===== */
  private updateStats(): void {
    this.activeCarts = this.cartList.filter(c => !c.isDeleted).length;
    this.totalValue = this.cartList.reduce((sum, c) => sum + c.totalAfterDiscount, 0);
    this.avgCartValue = this.totalCarts ? this.totalValue / this.totalCarts : 0;
  }

  getStatsCards(): StatCard[] {
    return [
      {
        label: 'Total Carts',
        value: this.totalCarts.toString(),
        bgClass: 'bg-gradient-to-br from-blue-100 to-blue-200',
        iconClass: 'text-blue-600',
        iconPath: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
      },
      {
        label: 'Total Value',
        value: this.formatCurrency(this.totalValue),
        bgClass: 'bg-gradient-to-br from-green-100 to-green-200',
        iconClass: 'text-green-600',
        iconPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
      },
      {
        label: 'Active Carts',
        value: this.activeCarts.toString(),
        bgClass: 'bg-gradient-to-br from-orange-100 to-orange-200',
        iconClass: 'text-orange-600',
        iconPath: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
      },
      {
        label: 'Avg Cart',
        value: this.formatCurrency(this.avgCartValue),
        bgClass: 'bg-gradient-to-br from-purple-100 to-purple-200',
        iconClass: 'text-purple-600',
        iconPath: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z'
      }
    ];
  }

  /** ===== Filters & Search ===== */
  onSearch(): void {
    this.currentPage = 1; // Reset to first page when searching
    this.loadCarts();
  }

  onStatusChange(): void {
    this.currentPage = 1; // Reset to first page when filtering
    this.loadCarts();
  }

  onSortChange(): void {
    this.currentPage = 1; // Reset to first page when sorting
    this.loadCarts();
  }

  // Clear search
  clearSearch(): void {
    this.searchTerm = '';
    this.onSearch();
  }

  /** ===== Pagination ===== */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && !this.isLoading) {
      this.currentPage = page;
      this.loadCarts();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1 && !this.isLoading) {
      this.currentPage--;
      this.loadCarts();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages && !this.isLoading) {
      this.currentPage++;
      this.loadCarts();
    }
  }

  getVisiblePages(): number[] {
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  /** ===== Selection ===== */
  toggleSelectAll(): void {
    this.cartList.forEach(c => c.selected = this.selectAll);
  }

  updateSelectAll(): void {
    this.selectAll = this.cartList.length > 0 && this.cartList.every(c => c.selected);
  }

  hasSelectedCarts(): boolean {
    return this.cartList.some(c => c.selected);
  }

  getSelectedCount(): number {
    return this.cartList.filter(c => c.selected).length;
  }

  getSelectedCarts(): ICartWithSelection[] {
    return this.cartList.filter(c => c.selected);
  }

  clearSelection(): void {
    this.cartList.forEach(c => c.selected = false);
    this.selectAll = false;
  }

  /** ===== CRUD Navigation ===== */
  openCreateCartModal(): void {
    if (!this.isLoading) {
      this.router.navigate(['/createcart']);
    }
  }

  editCart(cart: ICart): void {
    if (!this.isLoading) {
      this.router.navigate(['/updatecart', cart._id]);
    }
  }

  editCartFromView(): void {
    if (this.selectedCart && !this.isLoading) {
      this.editCart(this.selectedCart);
    }
  }

  viewCart(cart: ICart): void {
    if (!this.isLoading) {
      this.router.navigate(['/viewcart', cart._id]);
    }
  }

  /** ===== Delete ===== */
  confirmDelete(cart: ICart): void {
    if (!this.isLoading) {
      this.cartToDelete = cart;
      this.showDeleteModal = true;
    }
  }

  deleteCart(id: string): void {
    if (!id || this.isLoading) return;
    if (!confirm('Are you sure you want to delete this cart?')) return;

    this.cartApiService.deleteCartById(id).subscribe({
      next: () => {
        // Refresh the current page to get updated data
        this.refreshCarts();
      },
      error: (err) => console.error('Error deleting cart:', err)
    });
  }

  // Bulk delete selected carts
  deleteSelectedCarts(): void {
    if (this.isLoading) return;
    
    const selectedCarts = this.getSelectedCarts();
    if (selectedCarts.length === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedCarts.length} cart(s)?`)) return;

    const deletePromises = selectedCarts.map(cart =>
      this.cartApiService.deleteCartById(cart._id!)
    );

    Promise.all(deletePromises).then(() => {
      this.refreshCarts();
    }).catch(err => {
      console.error('Error deleting carts:', err);
    });
  }

  /** ===== Restore ===== */
  restoreCart(cart: ICart): void {
    if (!cart._id || this.isLoading) return;

    // Call restore API if available
    // this.cartApiService.restoreCartById(cart._id).subscribe({
    //   next: () => this.refreshCarts(),
    //   error: (err) => console.error('Error restoring cart:', err)
    // });

    // For now, just reload the data
    this.refreshCarts();
  }

  /** ===== Utilities ===== */
  getTotalQuantity(cart: ICart): number {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString();
  }

  isFirstPage(): boolean {
    return this.currentPage === 1;
  }

  isLastPage(): boolean {
    return this.currentPage === this.totalPages;
  }

  getPaginationInfo(): string {
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalCarts);
    return `Showing ${start}-${end} of ${this.totalCarts} carts`;
  }

  /** ===== Loading State Helpers ===== */
  getSkeletonArray(count: number): number[] {
    return Array.from({ length: count }, (_, i) => i + 1);
  }
}