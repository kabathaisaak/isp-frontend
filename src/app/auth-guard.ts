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
      const role = localStorage.getItem('role');

      if (access) {
        // ✅ Role-based redirection
        if (role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else if (role === 'subscriber') {
          this.router.navigate(['/packages']);
        }
        return true;
      }
    }

    this.router.navigate(['/login']);
    return false;
  }
}
