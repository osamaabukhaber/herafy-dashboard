// src/app/components/orders/order-status-update/order-status-update.component.ts

import { Component, input, output, signal, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// import { OrderService } from '../../services/order.service.js';
// import { Order, OrderResponse } from '../../../../shared/models/order.interface.js';

@Component({
  selector: 'app-order-status-update',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
templateUrl:'./order-status-update.component.html'
})
export class OrderStatusUpdateComponent {
  readonly orderService = inject(OrderService);
  readonly fb = inject(FormBuilder);

  // Inputs and Outputs
  readonly order = input.required<Order>();
  readonly updated = output<Order>();
  readonly cancel = output<void>();

  // Signals
  readonly updating = signal(false);
  readonly error = signal<string | null>(null);

  // Form
  readonly statusForm: FormGroup;

  // Status definitions
  private readonly statusDefinitions = [
    { value: 'pending', label: 'Pending', icon: '⏳', description: 'Order is waiting for payment confirmation' },
    { value: 'paid', label: 'Paid', icon: '💳', description: 'Payment has been confirmed and order is ready for processing' },
    { value: 'processing', label: 'Processing', icon: '⚙️', description: 'Order is being prepared and packaged' },
    { value: 'shipped', label: 'Shipped', icon: '🚚', description: 'Order has been dispatched and is on the way' },
    { value: 'delivered', label: 'Delivered', icon: '✅', description: 'Order has been successfully delivered to customer' },
    { value: 'cancelled', label: 'Cancelled', icon: '❌', description: 'Order has been cancelled and stock will be restored' },
    { value: 'payment_failed', label: 'Payment Failed', icon: '💥', description: 'Payment could not be processed' },
    { value: 'refunded', label: 'Refunded', icon: '💰', description: 'Order has been refunded to customer' }
  ];

  constructor() {
    this.statusForm = this.fb.group({
      status: ['', [Validators.required]]
    });
  }

  readonly availableStatuses = computed(() => {
    const currentStatus = this.order().status;

    // Define valid status transitions
    const validTransitions: Record<string, string[]> = {
      'pending': ['paid', 'cancelled', 'payment_failed'],
      'paid': ['processing', 'cancelled'],
      'processing': ['shipped', 'cancelled'],
      'shipped': ['delivered'],
      'delivered': ['refunded'],
      'cancelled': [], // No transitions from cancelled
      'payment_failed': ['paid', 'cancelled'],
      'refunded': [] // No transitions from refunded
    };

    const allowedStatuses = validTransitions[currentStatus] || [];

    return this.statusDefinitions.filter(status =>
      allowedStatuses.includes(status.value)
    );
  });

  readonly selectedStatusDescription = computed(() => {
    const selectedStatus = this.statusForm.get('status')?.value;
    return this.statusDefinitions.find(s => s.value === selectedStatus)?.description || null;
  });

  readonly isIrreversibleAction = computed(() => {
    const selectedStatus = this.statusForm.get('status')?.value;
    return ['delivered', 'cancelled', 'refunded'].includes(selectedStatus);
  });

  handleSubmit(): void {
    if (!this.statusForm.valid) {
      this.statusForm.markAllAsTouched();
      return;
    }

    const newStatus = this.statusForm.get('status')?.value as Order['status'];
    const orderId = this.order()._id;

    if (!orderId) {
      this.error.set('Invalid order ID');
      return;
    }

    this.updating.set(true);
    this.error.set(null);

    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: (response) => {
        const updatedOrder = response.data as Order;
        this.updated.emit(updatedOrder);
        this.updating.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to update order status');
        this.updating.set(false);
        console.error('Error updating order status:', err);
      }
    });
  }
}

// src/app/components/orders/order-routing.module.ts
import { Routes } from '@angular/router';
import { Order } from '../../../../shared/models/order.interface.js';
import { OrderService } from '../../services/order.service.js';

export const orderRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('../order-list/order-list.component.js').then(m => m.OrderListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('../create-order/create-order.component.js').then(m => m.CreateOrderComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('../order-list/order-list.component.js').then(m => m.OrderListComponent),
    data: { listType: 'admin' }
  },
  {
    path: 'seller',
    loadComponent: () => import('../order-list/order-list.component.js').then(m => m.OrderListComponent),
    data: { listType: 'seller' }
  },
  {
    path: ':id',
    loadComponent: () => import('../order-detail/order-detail.component.js').then(m => m.OrderDetailComponent)
  }
];

