// src/app/resolvers/auth-status.resolver.ts
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthStatusResolver implements Resolve<boolean> {
  constructor(private authService: AuthService) {}

  resolve(): Observable<boolean> {
    return this.authService.isUserLoggedIn(); // returns Observable<boolean>
  }
}
