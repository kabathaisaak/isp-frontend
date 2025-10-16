import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // ✅ SSR-safe check
    const isBrowser = typeof window !== 'undefined';
    const token = isBrowser ? localStorage.getItem('access') : null;
    const role = isBrowser ? localStorage.getItem('role') : null;

    // ✅ Public route: anyone can access packages
    if (route.routeConfig?.path === 'packages') return true;

    // 🚫 Logged-in users shouldn't access login/register again
    if ((route.routeConfig?.path === 'login' || route.routeConfig?.path === 'register') && token && role) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    // ✅ Protected routes require auth
    if (!token || !role) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
