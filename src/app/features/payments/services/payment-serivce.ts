// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { map, Observable, retry } from 'rxjs';
// import { environment } from '../../../environment/environment.developemnt';
// import { IpaymentsApiResponce } from '../../../models/payment-model/ipayments-api-responce';
// import { IpaymentsItemResponce } from '../../../models/payment-model/ipayments-item-responce';
// import { Ipayments } from '../../../models/payment-model/ipayments';

// @Injectable({
//   providedIn: 'root'
// })
// export class PaymentService {
//   private baseUrl = environment.apiBaseUrl + '/payment';

//   constructor(private http: HttpClient) {}

//   /**
//    * Get all payments (Admin only) with pagination & optional filters
//    */
//   getAllPayments(page: number = 1, limit: number = 10, filters?: Record<string, any>): Observable<IpaymentsApiResponce> {
//     let params = new HttpParams()
//       .set('page', page.toString())
//       .set('limit', limit.toString());

//     if (filters) {
//       Object.keys(filters).forEach(key => {
//         if (filters[key] !== undefined && filters[key] !== null) {
//           params = params.set(key, filters[key]);
//         }
//       });
//     }

//     return this.http.get<IpaymentsApiResponce>(`${this.baseUrl}`, { params });
//   }

//   /**
//    * Get a payment by its ID (Admin only)
//    */
//   getPaymentById(id: string): Observable<IpaymentsItemResponce> {
//     return this.http.get<IpaymentsItemResponce>(`${this.baseUrl}/${id}`);
//   }

//   /**
//    * Update payment status (Admin only)
//    */
//   updatePaymentStatus(id: string, status: 'pending' | 'completed' | 'failed' | 'refunded'): Observable<Ipayments> {
//     return this.http.patch<Ipayments>(`${this.baseUrl}/${id}/status`, { status });
//   }

//   // get all ids
//   getAllPaymentIds(): Observable<string[]> {
//         return this.http.get<IpaymentsApiResponce>(this.baseUrl).pipe(
//           retry(3), // Retry up to 3 times in case of failure
//           map((response: IpaymentsApiResponce) => response.data.payments
//             .map(payment => payment._id)
//             .filter((id): id is string => typeof id === 'string')
//           ) // Extracting IDs from the payments and filtering out undefined
//         );
//   }


  ////////////////////////

  import { Injectable } from '@angular/core';
  import { HttpClient, HttpParams } from '@angular/common/http';
  import { map, Observable, retry } from 'rxjs';
  import { environment } from '../../../environment/environment.developemnt';
  import { IpaymentsApiResponce } from '../../../models/payment-model/ipayments-api-responce';
  import { IpaymentsItemResponce } from '../../../models/payment-model/ipayments-item-responce';
  import { Ipayments } from '../../../models/payment-model/ipayments';

  // Add new interfaces for payment methods
  export interface PaymentMethod {
    _id: string;
    name: string;
    type: 'credit_card' | 'debit_card' | 'paypal' | 'cash' | 'bank_transfer';
    isActive: boolean;
    description?: string;
    icon?: string;
    processingFee?: number;
  }

  export interface PaymentMethodsResponse {
    status: string;
    data: PaymentMethod[];
  }

  @Injectable({
    providedIn: 'root'
  })
  export class PaymentService {
    private baseUrl = environment.apiBaseUrl + '/payment';

    constructor(private http: HttpClient) {}

    // ========== EXISTING METHODS (Payment Records Management) ==========

    /**
     * Get all payments (Admin only) with pagination & optional filters
     */
    getAllPayments(page: number = 1, limit: number = 10, filters?: Record<string, any>): Observable<IpaymentsApiResponce> {
      let params = new HttpParams()
        .set('page', page.toString())
        .set('limit', limit.toString());

      if (filters) {
        Object.keys(filters).forEach(key => {
          if (filters[key] !== undefined && filters[key] !== null) {
            params = params.set(key, filters[key]);
          }
        });
      }

      return this.http.get<IpaymentsApiResponce>(`${this.baseUrl}`, { params });
    }

    /**
     * Get a payment by its ID (Admin only)
     */
    getPaymentById(id: string): Observable<IpaymentsItemResponce> {
      return this.http.get<IpaymentsItemResponce>(`${this.baseUrl}/${id}`);
    }

    /**
     * Update payment status (Admin only)
     */
    updatePaymentStatus(id: string, status: 'pending' | 'completed' | 'failed' | 'refunded'): Observable<Ipayments> {
      return this.http.patch<Ipayments>(`${this.baseUrl}/${id}/status`, { status });
    }

    /**
     * Get all payment IDs
     */
    getAllPaymentIds(): Observable<string[]> {
      return this.http.get<IpaymentsApiResponce>(this.baseUrl).pipe(
        retry(3), // Retry up to 3 times in case of failure
        map((response: IpaymentsApiResponce) => response.data.payments
          .map(payment => payment._id)
          .filter((id): id is string => typeof id === 'string')
        ) // Extracting IDs from the payments and filtering out undefined
      );
    }

    // ========== NEW METHODS (Payment Methods for Order Creation) ==========

    /**
     * Get available payment methods for order creation
     * This is what you need for your order form!
     */
    getPaymentMethods(): Observable<PaymentMethodsResponse> {
      return this.http.get<PaymentMethodsResponse>(`${environment.apiBaseUrl}/payment-methods`)
        .pipe(
          retry(2) // Retry on failure
        );
    }

    /**
     * Get active payment methods only (filtered)
     */
    getActivePaymentMethods(): Observable<PaymentMethod[]> {
      return this.getPaymentMethods().pipe(
        map(response => response.data.filter(method => method.isActive))
      );
    }

    /**
     * Get a specific payment method by ID
     */
    getPaymentMethodById(methodId: string): Observable<PaymentMethod | null> {
      return this.getPaymentMethods().pipe(
        map(response => response.data.find(method => method._id === methodId) || null)
      );
    }

    /**
     * Format payment method for display
     */
    formatPaymentDisplay(payment: PaymentMethod): string {
      const fee = payment.processingFee ? ` (+${payment.processingFee}% fee)` : '';
      return `${payment.name}${fee}`;
    }

    /**
     * Get payment method icon CSS class
     */
    getPaymentIcon(paymentType: string): string {
      const icons: Record<string, string> = {
        'credit_card': '💳',
        'debit_card': '💳',
        'paypal': '🅿️',
        'cash': '💵',
        'bank_transfer': '🏦'
      };
      return icons[paymentType] || '💳';
    }
  }



