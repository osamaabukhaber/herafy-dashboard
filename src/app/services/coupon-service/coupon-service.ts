import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment.developemnt';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CouponResponse, CouponListResponse, ICoupon } from '../../shared/models/coupon.interface';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  private baseUrl = `${environment.apiBaseUrl}/coupon`;

  constructor(private http: HttpClient) {}

  getAllCupons(): Observable<CouponListResponse> {
    return this.http.get<CouponListResponse>(this.baseUrl, {
      withCredentials: true
    });
  }

  addCupon(coupon: ICoupon): Observable<CouponResponse> {
    return this.http.post<CouponResponse>(this.baseUrl, coupon, {
      withCredentials: true
    });
  }

  getCuponById(id: string): Observable<CouponResponse> {
    return this.http.get<CouponResponse>(`${this.baseUrl}/${id}`, {
      withCredentials: true
    });
  }

  updateCoupon(id: string, updatedCoupon: Partial<ICoupon>): Observable<CouponResponse> {
    return this.http.patch<CouponResponse>(`${this.baseUrl}/${id}`, updatedCoupon, {
      withCredentials: true
    });
  }

  deleteCoupon(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`, {
      withCredentials: true
    });
  }

  filterCouponByActive(active: boolean): Observable<CouponListResponse> {
    return this.http.get<CouponListResponse>(`${this.baseUrl}/filter/${active}`, {
      withCredentials: true
    });
  }

  searchCouponByCode(code: string): Observable<CouponListResponse> {
    return this.http.get<CouponListResponse>(`${this.baseUrl}/search/${code}`, {
      withCredentials: true
    });
  }
}
