// src/app/auth-interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';

const BASE_URL = 'http://localhost:8000/api/auth/'; 

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const access = localStorage.getItem('access');
  if (access) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${access}` },
    });
  }

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && localStorage.getItem('refresh')) {
        const http = inject(HttpClient);
        const refresh = localStorage.getItem('refresh');

        return http.post<{ access: string }>(`${BASE_URL}token/refresh/`, { refresh }).pipe(
          switchMap((res) => {
            // Save the new access token
            localStorage.setItem('access', res.access);

            // Retry original request with new token
            const newReq = req.clone({
              setHeaders: { Authorization: `Bearer ${res.access}` },
            });
            return next(newReq);
          }),
          catchError((refreshErr) => {
            console.error('Refresh token failed', refreshErr);
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            // Here you could also redirect to login
            return throwError(() => err);
          })
        );
      }
      return throwError(() => err);
    })
  );
};
