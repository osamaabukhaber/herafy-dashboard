import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment.developemnt';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Category,
  CategoryResponse,
  NewCategoryResponse,
} from '../../shared/models/category.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl = `${environment.apiBaseUrl}/category`;
  constructor(private http: HttpClient) {}

  getAllCategories(page: number = 1, limit: number = 10): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(this.baseUrl, {
      withCredentials: true,
      params: {
        page: page.toString(),
        limit: limit.toString(),
      },
    });
  }

  addNewCategory(name: string, imageFile?: File): Observable<NewCategoryResponse> {
    const formData = new FormData();
    formData.append('name', name);
    if (imageFile) {
      formData.append('image', imageFile);
    }
    return this.http.post<NewCategoryResponse>(this.baseUrl, formData, {
      withCredentials: true,
    });
  }

  getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/${id}`, {
      withCredentials: true,
    });
  }

  deleteCategory(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`, {
      withCredentials: true,
    });
  }

  updateCategory(
    id: string,
    name: string,
    imageFile?: File
  ): Observable<Category> {
    const formData = new FormData();
    formData.append('name', name);
    if (imageFile) {
      formData.append('image', imageFile);
    }
    return this.http.patch<Category>(`${this.baseUrl}/${id}`, formData, {
      withCredentials: true,
    });
  }

  filterCategoryByName(name: string): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/filter/${name}`, {
      withCredentials: true,
    });
  }

  searchCategoryByName(name: string): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/search/${name}`, {
      withCredentials: true,
    });
  }
}