import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ReviewApiResponse,
  ReviewSummary,
} from '../../shared/models/review.interface';
import { environment } from '../../environment/environment.developemnt';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private baseUrl = `${environment.apiBaseUrl}/review`;

  constructor(private http: HttpClient) {}

  getAllReviews(page: string, limit: string): Observable<ReviewApiResponse> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    const headers = this.getAuthHeaders();

    return this.http.get<ReviewApiResponse>(this.baseUrl, {
      withCredentials: true,
      params,
      headers,
    });
  }

  deleteReview(reviewId: string): Observable<ReviewApiResponse> {
    const headers = this.getAuthHeaders();
    return this.http.delete<ReviewApiResponse>(`${this.baseUrl}/${reviewId}`, {
      headers,
      withCredentials: true,
    });
  }

  getReviewSummary(
    entityId: string,
    entityType: string
  ): Observable<ReviewSummary> {
    const headers = this.getAuthHeaders();
    return this.http.get<ReviewSummary>(
      `${this.baseUrl}/summary/${entityId}/${entityType}`,
      { headers }
    );
  }

  getProductReviews(
    productId: string,
    page = 1,
    limit = 10
  ): Observable<ReviewApiResponse> {
    const params = new HttpParams()
      .set('productId', productId)
      .set('page', page.toString())
      .set('limit', limit.toString());
    const headers = this.getAuthHeaders();

    return this.http.get<ReviewApiResponse>(`${this.baseUrl}/filter`, {
      params,
      headers,
    });
  }

  getShopReviews(
    shopId: string,
    page = 1,
    limit = 10
  ): Observable<ReviewApiResponse> {
    const params = new HttpParams()
      .set('shopId', shopId)
      .set('page', page.toString())
      .set('limit', limit.toString());
    const headers = this.getAuthHeaders();

    return this.http.get<ReviewApiResponse>(`${this.baseUrl}/filter`, {
      params,
      headers,
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token =
      localStorage.getItem('authToken') ||
      localStorage.getItem('token') ||
      sessionStorage.getItem('authToken') ||
      sessionStorage.getItem('token');

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
      console.log('🔐 Auth token added');
    } else {
      console.warn('⚠️ No auth token found');
    }

    return headers;
  }
}
