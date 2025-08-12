// src/app/components/orders/order-detail/order-detail.component.ts
import { Component, OnInit, signal, computed, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import {  Order, OrderItem, UpdateOrderItemData } from '../../../services/order.service';
import { LoadingSpinnerComponent } from '../../../../shared/components/ui/loading/loading.component.js';
import { ConfirmDialogComponent } from '../../../../shared/components/ui/confirm-dialog/confirm-dialog.component.js';
import { OrderService } from '../../services/order.service.js';
import { Order, OrderItem, UpdateOrderItemData } from '../../../../shared/models/order.interface.js';
// import { LoadingSpinnerComponent } from '../../ui/loading-spinner/loading-spinner.component';
// import { ConfirmDialogComponent } from '../../ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-order-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    ConfirmDialogComponent
  ],
  template:'./order-detail.component.html'

})
export class OrderDetailComponent implements OnInit {
  readonly orderService = inject(OrderService);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly fb = inject(FormBuilder);

  // Signals
  readonly order = signal<Order | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly cancelling = signal(false);
  readonly updating = signal(false);
  readonly editingItemId = signal<string | null>(null);
  readonly showConfirmDialog = signal(false);

  // Form
  editForm: FormGroup | null = null;
  selectedImageFile: File | null = null;

  // Computed properties
  readonly orderTimeline = computed(() => {
    const order = this.order();
    if (!order) return [];

    const timeline = [
      {
        step: 1,
        label: 'Order Placed',
        completed: true,
        date: order.createdAt
      },
      {
        step: 2,
        label: 'Payment Confirmed',
        completed: ['paid', 'processing', 'shipped', 'delivered'].includes(order.status),
        date: order.paidAt
      },
      {
        step: 3,
        label: 'Processing',
        completed: ['processing', 'shipped', 'delivered'].includes(order.status),
        date: null
      },
      {
        step: 4,
        label: 'Shipped',
        completed: ['shipped', 'delivered'].includes(order.status),
        date: order.shippedAt
      },
      {
        step: 5,
        label: 'Delivered',
        completed: order.status === 'delivered',
        date: order.deliveredAt
      }
    ];

    return timeline;
  });

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.loadOrder(orderId);
    }
  }

  loadOrder(orderId?: string): void {
    const id = orderId || this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.loading.set(true);
    this.error.set(null);

    this.orderService.getOrderById(id).subscribe({
      next: (response) => {
        this.order.set(response.data as Order);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to load order');
        this.loading.set(false);
        console.error('Error loading order:', err);
      }
    });
  }

  canCancelOrder(): boolean {
    const order = this.order();
    return order ? !['shipped', 'delivered', 'cancelled', 'refunded'].includes(order.status) : false;
  }

  canEditOrder(): boolean {
    const order = this.order();
    return order ? ['pending', 'paid'].includes(order.status) : false;
  }

  handleCancelOrder(): void {
    this.showConfirmDialog.set(true);
  }

  confirmCancelOrder(): void {
    const order = this.order();
    if (!order?._id) return;

    this.cancelling.set(true);
    this.showConfirmDialog.set(false);

    this.orderService.cancelOrder(order._id).subscribe({
      next: (response) => {
        this.order.set({ ...order, status: 'cancelled' });
        this.cancelling.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to cancel order');
        this.cancelling.set(false);
        console.error('Error cancelling order:', err);
      }
    });
  }

  startEdit(item: OrderItem): void {
    this.editingItemId.set(item._id!);
    this.editForm = this.fb.group({
      name: [item.name, [Validators.required]],
      quantity: [item.quantity, [Validators.required, Validators.min(1)]]
    });
    this.selectedImageFile = null;
  }

  cancelEdit(): void {
    this.editingItemId.set(null);
    this.editForm = null;
    this.selectedImageFile = null;
  }

  onImageSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      this.selectedImageFile = target.files[0];
    }
  }

  handleUpdateItem(itemId: string): void {
    if (!this.editForm?.valid || !this.order()?._id) return;

    this.updating.set(true);

    const updateData: UpdateOrderItemData = {
      name: this.editForm.get('name')?.value,
      quantity: this.editForm.get('quantity')?.value
    };

    if (this.selectedImageFile) {
      updateData.image = this.selectedImageFile;
    }

    this.orderService.updateOrderItem(this.order()!._id!, itemId, updateData).subscribe({
      next: (response) => {
        // Reload the order to get updated data
        this.loadOrder();
        this.cancelEdit();
        this.updating.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to update item');
        this.updating.set(false);
        console.error('Error updating item:', err);
      }
    });
  }
}
