// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from "../../environment/environment.developemnt";
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiBaseUrl; // Adjust to your backend URL

  constructor(private http: HttpClient) {}

  isUserLoggedIn(): Observable<boolean> {
    return this.http
      .get<{ loggedIn: boolean }>(`${this.baseUrl}/auth/status`, {
        withCredentials: true,
      })
      .pipe(
        map((res) => {
          console.log('User logged in status:', res.loggedIn);
          return res.loggedIn;
        }),
        catchError(() => of(false))
      );
  }
}

