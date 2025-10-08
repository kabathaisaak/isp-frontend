import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

const BASE_URL = 'http://localhost:8000/api/auth/';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const http = inject(HttpClient);

  let access: string | null = null;
  let refresh: string | null = null;
  let userId: string | null = null;

  if (isPlatformBrowser(platformId)) {
    access = localStorage.getItem('access');
    refresh = localStorage.getItem('refresh');
    userId = localStorage.getItem('user_id'); // store this when logging in
  }

  // 🔒 Secure endpoints: apply auth only for protected routes
  const protectedRoutes = ['/plans', '/customers', '/billing'];

  const isProtected = protectedRoutes.some((endpoint) =>
    req.url.includes(endpoint)
  );

  // 🔑 Attach access token if available and route is protected
  if (access && isProtected) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${access}` },
    });

    // Optionally attach the user ID (if your backend filters by it)
    if (userId && req.method === 'GET') {
      const url = new URL(req.url, window.location.origin);
      if (!url.searchParams.has('user')) {
        url.searchParams.append('user', userId);
      }
      req = req.clone({ url: url.toString() });
    }
  }

  // 🚀 Continue with the request
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // 🔄 Refresh token if access expired
      if (err.status === 401 && refresh) {
        return http.post<{ access: string }>(`${BASE_URL}token/refresh/`, { refresh }).pipe(
          switchMap((res) => {
            if (isPlatformBrowser(platformId)) {
              localStorage.setItem('access', res.access);
            }

            const newReq = req.clone({
              setHeaders: { Authorization: `Bearer ${res.access}` },
            });

            return next(newReq);
          }),
          catchError((refreshErr) => {
            console.error('🔒 Refresh token failed:', refreshErr);

            if (isPlatformBrowser(platformId)) {
              localStorage.removeItem('access');
              localStorage.removeItem('refresh');
              localStorage.removeItem('user_id');
            }

            return throwError(() => err);
          })
        );
      }

      return throwError(() => err);
    })
  );
};
