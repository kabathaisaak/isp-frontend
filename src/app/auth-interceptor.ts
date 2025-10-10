import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

const BASE_URL = 'http://localhost:8000/api/auth/';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const http = inject(HttpClient);
  const router = inject(Router);

  let access: string | null = null;
  let refresh: string | null = null;

  if (isPlatformBrowser(platformId)) {
    access = localStorage.getItem('access');
    refresh = localStorage.getItem('refresh');
  }

  // Add access token to protected requests
  const protectedRoutes = ['/plans', '/invoices', '/payments', '/customers'];
  const isProtected = protectedRoutes.some((endpoint) => req.url.includes(endpoint));

  if (access && isProtected) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${access}` },
    });
  }

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        // 🔒 If user not authenticated or token expired
        if (isPlatformBrowser(platformId)) {
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
        }

        router.navigate(['/login']); // 🚀 Redirect to login
      }
      return throwError(() => err);
    })
  );
};
