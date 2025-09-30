import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role'); 

    if (token && role === 'admin') {
      return true; // allow admin
    }

    // redirect non-logged or non-admin
    this.router.navigate(['/login']);
    return false;
  }
}
