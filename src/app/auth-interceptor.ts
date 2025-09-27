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

  if (isPlatformBrowser(platformId)) {
    access = localStorage.getItem('access');
    refresh = localStorage.getItem('refresh');
  }

  // 🔑 Attach access token if available
  if (access) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${access}` },
    });
  }

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // 🔄 Try refreshing token if access is expired
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
            console.error('Refresh token failed', refreshErr);

            if (isPlatformBrowser(platformId)) {
              localStorage.removeItem('access');
              localStorage.removeItem('refresh');
            }

            return throwError(() => err);
          })
        );
      }
      return throwError(() => err);
    })
  );
};
