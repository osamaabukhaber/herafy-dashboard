import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment.developemnt';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CouponResponse } from '../../shared/models/Api Responses/couponResponse';
import { CouponInterface } from '../../shared/models/coupon.interface';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  private baseUrl = `${environment.apiBaseUrl}/coupon`;

  constructor(private http: HttpClient){}
  // get all coupons
  getAllCupons(): Observable<CouponResponse>{
    return this.http.get<CouponResponse>(this.baseUrl,{
      withCredentials: true
    })
  };
  // add new coupon
  addCupon(coupon: CouponInterface): Observable<CouponResponse> {
    return this.http.post<CouponResponse>(this.baseUrl, coupon, {
      withCredentials: true
    })
  };
  // get coupon by Id
  getCuponById(id: string): Observable<CouponInterface> {
    return this.http.get<CouponInterface>(`${this.baseUrl}/${id}`, {
      withCredentials: true
    })
  };
  // update coupon
  updateCoupon(id: string, updatedCoupon: Partial<CouponInterface>): Observable<CouponInterface>{
    return this.http.patch<CouponInterface>(`${this.baseUrl}/${id}`,updatedCoupon, {
      withCredentials: true
    })
  };
  // deleet coupon
  deleteCoupon(id: string): Observable<{message: string}>{
    return this.http.delete<{message: string}>(`${this.baseUrl}/${id}`, {
      withCredentials: true
    })
  };
  // filter coupon
  filterCouponByActive(active: boolean): Observable<CouponInterface[]>{
    return this.http.get<CouponInterface[]>(`${this.baseUrl}/filter/${active}`, {
      withCredentials: true
    })
  };
  // search coupon
  searchCouponByCode(code: string): Observable<CouponInterface[]>{
    return this.http.get<CouponInterface[]>(`${this.baseUrl}/search/${code}`, {
      withCredentials: true
    })
  }
}
