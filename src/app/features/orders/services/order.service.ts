// src/app/services/order.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environment/environment.developemnt.js';
import { CreateOrderData, Order, OrderResponse, UpdateOrderItemData } from '../../../shared/models/order.interface.js';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/order`;

  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  // User Orders
  createOrder(orderData: CreateOrderData): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.baseUrl, orderData, { withCredentials: true });
  }

  getUserOrders(page = 1, limit = 10): Observable<OrderResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    // Use admin endpoint since user endpoint is restricted
    return this.http.get<OrderResponse>(`${this.baseUrl}/admin/orders`, {
      withCredentials: true,
      params
    });
  }

  getOrderById(orderId: string): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.baseUrl}/${orderId}`, { withCredentials: true });
  }

  cancelOrder(orderId: string): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(`${this.baseUrl}/${orderId}/cancel`, {}, { withCredentials: true });
  }

  deleteOrder(orderId: string): Observable<OrderResponse> {
    return this.http.delete<OrderResponse>(`${this.baseUrl}/${orderId}`, { withCredentials: true });
  }

  updateOrderItem(orderId: string, itemId: string, updateData: UpdateOrderItemData): Observable<OrderResponse> {
    const formData = new FormData();

    if (updateData.name) formData.append('name', updateData.name);
    if (updateData.quantity) formData.append('quantity', updateData.quantity.toString());
    if (updateData.image) formData.append('image', updateData.image);

    return this.http.patch<OrderResponse>(`${this.baseUrl}/${orderId}/items/${itemId}`, formData, { withCredentials: true });
  }

  // Admin Orders
  getAllOrders(page = 1, limit = 10): Observable<OrderResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<OrderResponse>(`${this.baseUrl}/admin/orders`, {
      params,
      withCredentials: true,
    });
  }

  getAdminOrderById(orderId: string): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.baseUrl}/admin/orders/${orderId}`, { withCredentials: true });
  }

  updateOrderStatus(orderId: string, status: Order['status']): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(`${this.baseUrl}/admin/orders/${orderId}/status`, { status }, { withCredentials: true });
  }

  // Seller Orders
  getSellerOrders(page = 1, limit = 10): Observable<OrderResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<OrderResponse>(`${this.baseUrl}/seller/orders`, {
      params,
      withCredentials: true
    });
  }

  // Utility methods
  getStatusColor(status: Order['status']): string {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      payment_failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  }

  getStatusIcon(status: Order['status']): string {
    const statusIcons = {
      pending: '⏳',
      paid: '💳',
      processing: '⚙️',
      shipped: '🚚',
      delivered: '✅',
      cancelled: '❌',
      payment_failed: '💥',
      refunded: '💰'
    };
    return statusIcons[status] || '❓';
  }

  formatCurrency(amount: number, currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }
}
