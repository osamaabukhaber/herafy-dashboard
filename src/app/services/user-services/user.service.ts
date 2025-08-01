import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../../models/iuser';
import { environment } from '../../environment/environment.developemnt';
import { UsersApiResponse } from '../../models/users-api-response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = `${environment.apiBaseUrl}/api/users`;

  constructor(private http: HttpClient) {}

  /**
   * GET /api/users/search?role=vendor
   * Admin: Search users by role
   */
  searchUsersByRole(
    role: 'admin' | 'customer' | 'vendor'
  ): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.baseUrl}/search?role=${role}`);
  }

  /**
   * GET /api/users
   * Admin: Get all users
   */
  /*   getAllUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.baseUrl);
  } */
  getAllUsers(): Observable<UsersApiResponse> {
    return this.http.get<UsersApiResponse>(this.baseUrl);
  }

  /**
   * GET /api/users/:id
   * Admin: Get single user by ID
   */
  getUserById(id: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.baseUrl}/${id}`);
  }

  updateUserByAdmin(id: string, updateData: Partial<IUser>): Observable<IUser> {
    return this.http.patch<IUser>(`${this.baseUrl}/${id}`, updateData);
  }

  deleteUserByAdmin(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}
