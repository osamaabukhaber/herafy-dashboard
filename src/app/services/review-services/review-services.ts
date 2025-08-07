import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
  private baseUrl = `${environment.apiBaseUrl}/review`; // Update base URL if needed

  constructor(private http: HttpClient) {}

  // ✅ Get all reviews (optional filters)
  getAllReviews(
    entityId?: string,
    entityType?: string
  ): Observable<ReviewApiResponse> {
    let params = new HttpParams();
    if (entityId) params = params.set('entityId', entityId);
    if (entityType) params = params.set('entityType', entityType);

    return this.http.get<ReviewApiResponse>(`${this.baseUrl}`, { params });
  }

  // 🗑️ Delete a review by ID
  deleteReview(reviewId: string): Observable<ReviewApiResponse> {
    return this.http.delete<ReviewApiResponse>(`${this.baseUrl}/${reviewId}`);
  }

  // 📊 Get review summary
  getReviewSummary(
    entityId: string,
    entityType: string
  ): Observable<ReviewSummary> {
    return this.http.get<ReviewSummary>(
      `${this.baseUrl}/summary/${entityId}/${entityType}`
    );
  }
  // GET filtered product reviews (by productId)
  getProductReviews(
    productId: string,
    page = 1,
    limit = 10
  ): Observable<ReviewApiResponse> {
    const params = {
      productId,
      page,
      limit,
    };
    return this.http.get<ReviewApiResponse>(`${this.baseUrl}/filter`, {
      params,
    });
  }

  // GET filtered shop reviews (by shopId)
  getShopReviews(
    shopId: string,
    page = 1,
    limit = 10
  ): Observable<ReviewApiResponse> {
    const params = {
      shopId,
      page,
      limit,
    };
    return this.http.get<ReviewApiResponse>(`${this.baseUrl}/filter`, {
      params,
    });
  }
}
