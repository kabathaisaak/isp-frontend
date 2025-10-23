import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../shared';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  performance: any = {};
  packages: any[] = [];
  mikrotiks: any[] = [];
  users: any[] = [];
  loading = true;
  username: string | null = null;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    let authErrorCount = 0;

    forkJoin({
      performance: this.apiService.getPerformance().pipe(
        catchError((err) => {
          if (this.isAuthError(err)) authErrorCount++;
          this.handleError(err, 'Performance');
          return of({});
        })
      ),
      packages: this.apiService.getAdminPackages().pipe(
        catchError((err) => {
          if (this.isAuthError(err)) authErrorCount++;
          this.handleError(err, 'Packages');
          return of([]);
        })
      ),
      mikrotiks: this.apiService.getMyMikrotiks().pipe(
        catchError((err) => {
          if (this.isAuthError(err)) authErrorCount++;
          this.handleError(err, 'Mikrotiks');
          return of([]);
        })
      ),
      users: this.apiService.getAllUsers().pipe(
        catchError((err) => {
          if (this.isAuthError(err)) authErrorCount++;
          this.handleError(err, 'Users');
          return of([]);
        })
      )
    }).subscribe((result) => {
      this.performance = result.performance;
      this.packages = result.packages;
      this.mikrotiks = result.mikrotiks;
      this.users = result.users;
      this.loading = false;

      if (authErrorCount === 4) {
        alert('Session expired or unauthorized. Please log in again.');
        this.logout();
      }
    });
  }

  private isAuthError(err: any): boolean {
    return err?.status === 401 || err?.status === 403;
  }

  private handleError(err: any, source: string): void {
    console.error(`${source} error:`, err);
  }

  // ===========================
  // Navigation Methods
  // ===========================

  viewEarningsDetails(): void {
    this.router.navigate(['/reports/earnings']);
  }

  viewSmsDetails(): void {
    this.router.navigate(['/sms']);
  }

  viewClients(): void {
    this.router.navigate(['/customers']);
  }

  viewUsers(): void {
    this.router.navigate(['/users']);
  }

  viewPackages(): void {
    this.router.navigate(['/billing/plans']);
  }

  viewMikrotiks(): void {
    this.router.navigate(['/mikrotik']);
  }

  // ===========================
  // Logout
  // ===========================
  logout(): void {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}
