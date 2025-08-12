// src/app/components/orders/order-list/order-list.component.ts
import { Component, OnInit, signal, computed, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service.js';
import { Order, OrderResponse } from '../../../../shared/models/order.interface.js';
import { LoadingSpinnerComponent } from '../../../../shared/components/ui/loading/loading.component.js';
import { PaginationComponent } from '../../../../shared/components/ui/pagination/pagination.component.js';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component.js';



type OrderListType = 'user' | 'admin' | 'seller';

@Component({
  selector: 'app-order-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    PaginationComponent
  ],
templateUrl:'./order-list.component.html'
})
export class OrderListComponent implements OnInit {
  readonly orderService = inject(OrderService);
  readonly router = inject(Router);

  // Input properties
  readonly listType = input<OrderListType>('user');

  // Signals
  readonly orders = signal<Order[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly currentPage = signal(1);
  readonly totalPages = signal(1);
  readonly totalOrders = signal(0);
  readonly cancellingOrderId = signal<string | null>(null);

  // Computed properties
  readonly emptyStateDescription = computed(() => {
    switch (this.listType()) {
      case 'admin':
        return 'No orders have been placed yet.';
      case 'seller':
        return 'No orders have been placed for your stores yet.';
      default:
        return "You haven't placed any orders yet. Start shopping to create your first order!";
    }
  });

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(page = 1): void {
    this.loading.set(true);
    this.error.set(null);

    const request$ = this.getOrdersRequest(page);

    request$.subscribe({
      next: (response: OrderResponse) => {
        const data = response.data as { orders: Order[]; page: number; pages: number; total: number };
        this.orders.set(data?.orders??[]);
        this.currentPage.set(data.page);
        this.totalPages.set(data.pages);
        this.totalOrders.set(data.total);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to load orders');
        this.loading.set(false);
        console.error('Error loading orders:', err);
      }
    });
  }

  private getOrdersRequest(page: number) {
    switch (this.listType()) {
      case 'admin':
        return this.orderService.getAllOrders(page);
      case 'seller':
        return this.orderService.getSellerOrders(page);
      default:
        return this.orderService.getUserOrders(page);
    }
  }

  onPageChange(page: number): void {
    this.loadOrders(page);
  }

  canCancelOrder(order: Order): boolean {
    return !['shipped', 'delivered', 'cancelled', 'refunded'].includes(order.status);
  }

  handleCancelOrder(orderId: string): void {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    this.cancellingOrderId.set(orderId);

    this.orderService.cancelOrder(orderId).subscribe({
      next: (response) => {
        // Update the order in the list
        const updatedOrders = this.orders().map(order =>
          order._id === orderId ? { ...order, status: 'cancelled' as const } : order
        );
        this.orders.set(updatedOrders);
        this.cancellingOrderId.set(null);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to cancel order');
        this.cancellingOrderId.set(null);
        console.error('Error cancelling order:', err);
      }
    });
  }

  showStatusUpdate(order: Order): void {
    // This would open a modal or navigate to update status page
    // Implementation depends on your modal system
    console.log('Update status for order:', order._id);
  }
}
