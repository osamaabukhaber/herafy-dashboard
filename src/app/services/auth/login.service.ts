import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
export { renderModule } from '@angular/platform-server';
import { environment } from '../../environment/environment.developemnt';
import { IUser } from '../../models/iuser';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/auth`;

  private userSubject = new BehaviorSubject<IUser | null>(null);
  user$ = this.userSubject.asObservable();

  private tokenSubject = new BehaviorSubject<string | null>(null);
  token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {}

  signIn(credentials: {
    email: string;
    password: string;
  }): Observable<{ user: IUser }> {
    return this.http
      .post<{ user: IUser }>(`${this.baseUrl}/signin`, credentials, {
        withCredentials: true,
      })
      .pipe(
        tap((res) => {
          this.userSubject.next(res.user);
        })
      );
  }

  signOut(): void {
    this.http
      .post(`${this.baseUrl}/signout`, {}, { withCredentials: true })
      .subscribe({
        complete: () => {
          this.tokenSubject.next(null);
          this.userSubject.next(null);

          // Optional: force refresh to clear any stale app state
          location.reload();
        },
      });
  }

  isUserLoggedIn(): Observable<boolean> {
    return this.http
      .get<{ loggedIn: boolean }>(`${this.baseUrl}/status`, {
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
