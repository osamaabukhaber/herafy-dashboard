import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment.developemnt';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryResponse } from '../../shared/models/Api Responses/categoryResponse';
import { Category } from '../../shared/models/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = `${environment.apiBaseUrl}/category`;

  constructor(private http: HttpClient){}

  // get all categories
  getAllCategoty(): Observable<CategoryResponse>{
    return this.http.get<CategoryResponse>(this.baseUrl, {
      withCredentials: true
    })
  }
    // addNewCategory
  addNewCategory(category: Category): Observable<CategoryResponse>{
    return this.http.post<CategoryResponse>(this.baseUrl, category, {
      withCredentials: true
    })
  }

  // get category with Id
  getCategotyById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/${id}`, {
      withCredentials: true
    })
  }
  //deleteCategory
  deleteCategory(id: string):Observable<{message: string}>{
    return this.http.delete<{message: string}>(`${this.baseUrl}/${id}`,{
      withCredentials: true
    })
  }
  // update category
  UpdateCategory(id: string, updateData: Partial<Category>): Observable<Category>{
    return this.http.patch<Category>(`${this.baseUrl}/${id}`, updateData, {
      withCredentials: true
    })
  }
}
