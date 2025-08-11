import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart-service';
import { ICart, ICartItem } from '../../../../models/cart-model/icart';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Additional interfaces for admin functionality
interface IUser {
  _id: string;
  name: string;
  email: string;
}

interface IProduct {
  _id: string;
  name: string;
  price: number;
}

interface ICoupon {
  _id: string;
  code: string;
  discount: number; // percentage
}

interface ICartForm {
  _id?: string;
  user: string;
  items: ICartItemForm[];
  coupon?: string;
  total: number;
  discount: number;
  totalAfterDiscount: number;
  isDeleted: boolean;
}

interface ICartItemForm extends ICartItem {
  variantKey?: string;
  variantValue?: string;
}

interface ICartWithSelection extends ICart {
  selected?: boolean;
}

@Component({
  selector: 'app-cart-main-component',
  imports: [CommonModule, FormsModule], // Add FormsModule to imports array in your module
  templateUrl: './cart-main-component.html',
  styleUrl: './cart-main-component.css'
})
export class CartMainComponent implements OnInit {

  // Data properties
  cartList: ICartWithSelection[] = [];
  filteredCarts: ICartWithSelection[] = [];
  paginatedCarts: ICartWithSelection[] = [];
  users: IUser[] = [];
  products: IProduct[] = [];
  coupons: ICoupon[] = [];

  // Modal properties
  showCartModal: boolean = false;
  showViewModal: boolean = false;
  showDeleteModal: boolean = false;
  isEditMode: boolean = false;
  selectedCart: ICart | null = null;
  cartToDelete: ICart | null = null;

  // Form properties
  cartForm: ICartForm = this.initializeCartForm();

  // Filter and search properties
  searchTerm: string = '';
  selectedStatus: string = '';
  sortBy: string = 'createdAt';

  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;

  // Selection properties
  selectAll: boolean = false;

  // Stats properties
  totalCarts: number = 0;
  totalValue: number = 0;
  activeCarts: number = 0;
  avgCartValue: number = 0;

  slectedStatusOption: string[] = [
    "All Status",
    "Active",
    "Deleted"
  ]
  allowedSortFields: string[] = [
    'createdAt',
    'updatedAt',
    'total',
    'discount',
    'totalAfterDiscount'
  ];
  // Utility property for Math functions in template
  Math = Math;

  constructor(private cartApiService: CartService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadData();
  }

  // ===== Data Loading Methods =====

  loadData(): void {
    this.loadCarts();
  }

  loadCarts(): void {
    this.cartApiService.getAllCarts({ queryParams: { selectedStatus: this.selectedStatus }, sortBy: this.sortBy, page: this.currentPage, limit: this.pageSize }).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.cartList = response.data.carts.map((cart: ICart) => ({
            ...cart,
            selected: false
          }));
          this.filteredCarts = this.cartList;
          console.log('Carts loaded successfully:', this.cartList);
          this.updateStats();
          this.cdr.detectChanges();
        } else {
          console.error('Failed to fetch cart items:', response);
        }
      },
      error: (error) => {
        console.error('Error fetching cart items:', error);
      }
    });
  }
  // ===== Stats Methods =====

  updateStats(): void {
    this.totalCarts = this.cartList.length;
    this.activeCarts = this.cartList.filter(cart => !cart.isDeleted).length;
    this.totalValue = this.cartList.reduce((sum, cart) => sum + cart.totalAfterDiscount, 0);
    this.avgCartValue = this.totalCarts > 0 ? this.totalValue / this.totalCarts : 0;
  }

  // ===== Filter and Search Methods =====

  filterCarts(): void {
    let filtered = [...this.cartList];

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(cart =>
        cart.user && cart.user['userName'] && cart.user['userName'].toLowerCase().includes(term) ||
        cart.items.some(item =>
          item.product &&
          item.product['productName'] &&
          item.product['productName'].toLowerCase().includes(term)
        ) ||
        (cart._id && cart._id.toLowerCase().includes(term))
      );
      this.filteredCarts = filtered;
      this.cdr.detectChanges();
    }
  }
  filterByStatus(): void {
      this.loadCarts();
  }
  sortCarts(): void {
      this.loadCarts()
  }

  // ===== Pagination Methods =====


  goToPage(page: number): void {
    this.currentPage = page;
    this.loadCarts()
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadCarts()
    }

  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadCarts()
    }
  }

  getVisiblePages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  // ===== Selection Methods =====

  toggleSelectAll(): void {
    this.paginatedCarts.forEach(cart => cart.selected = this.selectAll);
  }

  updateSelectAll(): void {
    this.selectAll = this.paginatedCarts.length > 0 &&
      this.paginatedCarts.every(cart => cart.selected);
  }

  hasSelectedCarts(): boolean {
    return this.cartList.some(cart => cart.selected);
  }

  getSelectedCount(): number {
    return this.cartList.filter(cart => cart.selected).length;
  }

  // ===== CRUD Methods =====

  openCreateCartModal(): void {
    this.router.navigate(["/createcart"]);
  }

  editCart(cart: ICart): void {
    this.router.navigate(["/updatecart", cart._id]);
  }

  editCartFromView(): void {
    if (this.selectedCart) {
      this.editCart(this.selectedCart);
    }
  }

  viewCart(cart: ICart): void {
    this.router.navigate(["/viewcart", cart._id]);
  }

  confirmDelete(cart: ICart): void {
    this.cartToDelete = cart;
    this.showDeleteModal = true;
  }

  deleteCart(): void {
    if (this.cartToDelete && this.cartToDelete._id) {
      // TODO: Implement delete API call
      // this.cartApiService.deleteCart(this.cartToDelete._id).subscribe(...)

      // For now, update locally
      const index = this.cartList.findIndex(c => c._id === this.cartToDelete!._id);
      if (index !== -1) {
        this.cartList[index].isDeleted = true;
        this.updateStats();
        this.filterCarts();
      }
    }
  }

  restoreCart(cart: ICart): void {
    if (cart._id) {
      // TODO: Implement restore API call
      // this.cartApiService.restoreCart(cart._id).subscribe(...)

      // For now, update locally
      const index = this.cartList.findIndex(c => c._id === cart._id);
      if (index !== -1) {
        this.cartList[index].isDeleted = false;
        this.updateStats();
        this.filterCarts();
      }
    }
  }

  initializeCartForm(): ICartForm {
    return {
      user: '',
      items: [],
      total: 0,
      discount: 0,
      totalAfterDiscount: 0,
      isDeleted: false
    };
  }
  getTotalQuantity(cart: ICart): number {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  }
}
