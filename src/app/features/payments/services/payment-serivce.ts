import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, retry } from 'rxjs';
import { environment } from '../../../environment/environment.developemnt';
import { IpaymentsApiResponce } from '../../../models/payment-model/ipayments-api-responce';
import { IpaymentsItemResponce } from '../../../models/payment-model/ipayments-item-responce';
import { Ipayments } from '../../../models/payment-model/ipayments';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = environment.apiBaseUrl + '/payments';

  constructor(private http: HttpClient) {}

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

    return this.http.get<IpaymentsApiResponce>(`${this.baseUrl}`, { params , withCredentials: true });
  }

  /**
   * Get a payment by its ID (Admin only)
   */
  getPaymentById(id: string): Observable<IpaymentsItemResponce> {
    return this.http.get<IpaymentsItemResponce>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  /**
   * Update payment status (Admin only)
   */
  updatePaymentStatus(id: string, status: 'pending' | 'completed' | 'failed' | 'refunded'): Observable<Ipayments> {
    return this.http.patch<Ipayments>(`${this.baseUrl}/${id}/status`, { status }, { withCredentials: true });
  }

  // get all ids
  getAllPaymentIds(): Observable<string[]> {
        return this.http.get<IpaymentsApiResponce>(this.baseUrl, { withCredentials: true }).pipe(
          retry(3), // Retry up to 3 times in case of failure
          map((response: IpaymentsApiResponce) => response.data.payments
            .map(payment => payment._id)
            .filter((id): id is string => typeof id === 'string')
          ) // Extracting IDs from the payments and filtering out undefined
        );
  }

}
