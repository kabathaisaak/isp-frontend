import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private platformId = inject(PLATFORM_ID);

  constructor(private router: Router) {}

  canActivate(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const access = localStorage.getItem('access');
      const username = localStorage.getItem('username'); // optiona
      const role = localStorage.getItem('role'); // optional

      if (access /* && role === 'admin' */) {
        return true; // ✅ allow if access token exists
      }
    }

    this.router.navigate(['/login']);
    return false;
  }
}
