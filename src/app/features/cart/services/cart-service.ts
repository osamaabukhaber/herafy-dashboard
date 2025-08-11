import { Injectable, OnInit } from '@angular/core';
import { environment } from '../../../environment/environment.developemnt';
import { HttpClient } from '@angular/common/http';
import { map, Observable, retry } from 'rxjs';
import { IcartResponceApi } from '../../../models/cart-model/icart-responce-api';
import { ICart } from '../../../models/cart-model/icart';
import { IcartItemResponce } from '../../../models/cart-model/icart-item-responce';

@Injectable({
  providedIn: 'root'
})
export class CartService implements OnInit {
  baseUrl: string = "";
  constructor( private httpRequest: HttpClient ) {
    // Initialize the base URL for the cart service
    this.baseUrl = environment.apiBaseUrl + '/cart/all-carts';
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }
  getAllCarts({ queryParams, sortBy, page, limit }: { queryParams: any; sortBy: string; page: number; limit: number }): Observable<IcartResponceApi> {
    return this.httpRequest.get<IcartResponceApi>(this.baseUrl, { params: { ...queryParams, sortBy, page, limit } });
  }
  getCartById(cartId: string): Observable<IcartItemResponce> {
    const url = `${this.baseUrl}/${cartId}`;
    return this.httpRequest.get<IcartItemResponce>(url);
  }
  deleteCartById(cartId: string): Observable<IcartResponceApi> {
    const url = `${this.baseUrl}/${cartId}`;
    return this.httpRequest.delete<IcartResponceApi>(url);
  }
  updateCart(cartId: string, cartData: any): Observable<IcartResponceApi> {
    const url = `${this.baseUrl}/${cartId}`;
    return this.httpRequest.patch<IcartResponceApi>(url, cartData);
  }
  createCart(cartData: ICart): Observable<IcartResponceApi> {
    this.baseUrl = environment.apiBaseUrl + '/cart';
    return this.httpRequest.post<IcartResponceApi>(this.baseUrl, cartData);
  }
  getAllCartIds(): Observable<string[]> {
      return this.httpRequest.get<IcartResponceApi>(this.baseUrl).pipe(
        retry(3), // Retry up to 3 times in case of failure
        map((response: IcartResponceApi) => response.data.carts
          .map(cart => cart._id)
          .filter((id): id is string => typeof id === 'string')
        ) // Extracting IDs from the carts and filtering out undefined
      );
    }
    getAllProducts(): Observable<any> {
      this.baseUrl = environment.apiBaseUrl + '/products';
      return this.httpRequest.get<any>(this.baseUrl, { params: { limit: '3' } }).pipe(
        retry(3), // Retry up to 3 times in case of failure
      );
    }
}
