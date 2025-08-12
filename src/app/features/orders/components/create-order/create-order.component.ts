// src/app/components/orders/create-order/create-order.component.ts
import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingSpinnerComponent } from '../../../../shared/components/ui/loading/loading.component.js';
import { OrderService } from '../../services/order.service.js';
import { ProductApiService } from '../../../products/services/product-api.service.js';
import { CreateOrderData, ShippingAddress } from '../../../../shared/models/order.interface.js';
import { Product as SharedProduct } from '../../../../shared/models/product.interface.js';


// Use shared Product model; compute stock when needed

interface OrderItemForm {
  productId: string;
  quantity: number;
  product?: SharedProduct;
}

@Component({
  selector: 'app-create-order',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent
  ],
  templateUrl:"./create-order.component.html"

})
export class CreateOrderComponent implements OnInit {
  readonly orderService = inject(OrderService);
  readonly productService = inject(ProductApiService);
  readonly router = inject(Router);
  readonly fb = inject(FormBuilder);

  // Signals
  readonly availableProducts = signal<SharedProduct[]>([]);
  readonly loadingProducts = signal(false);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);

  // Form
  orderForm: FormGroup;

  constructor() {
    this.orderForm = this.fb.group({
      orderItems: this.fb.array([]),
      shippingAddress: this.fb.group({
        street: ['', [Validators.required]],
        city: ['', [Validators.required]],
        postalCode: ['', [Validators.required]],
        country: ['', [Validators.required]]
      })
    });
  }

  get orderItemsArray(): FormArray {
    return this.orderForm.get('orderItems') as FormArray;
  }

  ngOnInit(): void {
    this.loadProducts();
    this.addOrderItem(); // Add first item by default
  }

  loadProducts(): void {
    this.loadingProducts.set(true);


    this.productService.getProducts().subscribe({
      next: (response) => {
        this.availableProducts.set(response.products || []);
        this.loadingProducts.set(false);
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.loadingProducts.set(false);

      }
    });
  }

  addOrderItem(): void {
    const itemGroup = this.fb.group({
      productId: ['', [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });

    this.orderItemsArray.push(itemGroup);
  }

  removeOrderItem(index: number): void {
    if (this.orderItemsArray.length > 1) {
      this.orderItemsArray.removeAt(index);
    }
  }

  onProductChange(index: number, event: Event): void {
    const target = event.target as HTMLSelectElement;
    const productId = target.value;
    const product = this.availableProducts().find(p => p._id === productId);

    if (product) {
      const itemControl = this.orderItemsArray.at(index);
      const quantityControl = itemControl.get('quantity');

      // Update quantity validator based on computed stock
      const stock = this.computeProductStock(product);
      quantityControl?.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(stock)
      ]);
      quantityControl?.updateValueAndValidity();
    }
  }

  getSelectedProduct(index: number): SharedProduct | null {
    const productId = this.orderItemsArray.at(index).get('productId')?.value;
    return this.availableProducts().find(p => p._id === productId) || null;
  }

  getProductStock(index: number): number {
    const product = this.getSelectedProduct(index);
    return this.computeProductStock(product);
  }

  getItemTotal(index: number): number {
    const product = this.getSelectedProduct(index);
    const quantity = this.orderItemsArray.at(index).get('quantity')?.value || 0;
    return (product?.basePrice || 0) * quantity;
  }

  calculateSubtotal(): number {
    let subtotal = 0;
    for (let i = 0; i < this.orderItemsArray.length; i++) {
      subtotal += this.getItemTotal(i);
    }
    return subtotal;
  }

  calculateTax(): number {
    return this.calculateSubtotal() * 0.10; // 10% tax
  }

  calculateShipping(): number {
    const subtotal = this.calculateSubtotal();
    return subtotal >= 500 ? 0 : 20; // Free shipping over $500
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.calculateTax() + this.calculateShipping();
  }

  private computeProductStock(product: SharedProduct | null): number {
    if (!product?.variants) return 0;
    return product.variants.reduce((sum, variant) => {
      const optionsStock = Array.isArray(variant.options)
        ? variant.options.reduce((s, option) => s + (option?.stock ?? 0), 0)
        : 0;
      return sum + optionsStock;
    }, 0);
  }

  handleSubmit(): void {
    if (!this.orderForm.valid || this.orderItemsArray.length === 0) {
      this.orderForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    // Prepare order data
    const orderData: CreateOrderData = {
      orderItems: this.orderItemsArray.value.map((item: OrderItemForm) => ({
        product: item.productId,
        quantity: item.quantity
      })),
      shippingAddress: this.orderForm.get('shippingAddress')?.value as ShippingAddress
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        this.submitting.set(false);
        // Navigate to order details or orders list
        const order = response.data;
        if (typeof order === 'object' && '_id' in order) {
          this.router.navigate(['/orders', order._id]);
        } else {
          this.router.navigate(['/orders']);
        }
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to create order');
        this.submitting.set(false);
        console.error('Error creating order:', err);
      }
    });
  }
}
