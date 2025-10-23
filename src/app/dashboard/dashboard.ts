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

  /**
   * Load all dashboard data concurrently
   */
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

      // Logout only if *all* requests failed with auth errors
      if (authErrorCount === 4) {
        alert('Session expired or unauthorized. Please log in again.');
        this.logout();
      }
    });
  }

  /**
   * Helper: Detect authorization errors
   */
  private isAuthError(err: any): boolean {
    return err?.status === 401 || err?.status === 403;
  }

  /**
   * Generic error handler (non-auth errors just log)
   */
  private handleError(err: any, source: string): void {
    console.error(`${source} error:`, err);
  }

  /**
   * Package management actions
   */
  createPackage(): void {
    this.router.navigate(['/billing/plans/create']);
  }

  editPackage(pkg: any): void {
    this.router.navigate([`/billing/plans/${pkg.id}/edit`]);
  }

  deletePackage(pkg: any): void {
    if (!confirm(`Delete package "${pkg.name}"? This cannot be undone.`)) return;
    this.apiService.deleteAdminPackage(pkg.id).subscribe({
      next: () => {
        this.packages = this.packages.filter(p => p.id !== pkg.id);
      },
      error: (err) => this.handleError(err, 'Delete Package')
    });
  }

  /**
   * Mikrotik management actions
   */
  createMikrotik(): void {
    this.router.navigate(['/mikrotik/create']);
  }

  editMikrotik(m: any): void {
    this.router.navigate([`/mikrotik/${m.id}/edit`]);
  }

  deleteMikrotik(m: any): void {
    if (!confirm(`Delete Mikrotik "${m.name}"?`)) return;
    this.apiService.deleteMikrotik(m.id).subscribe({
      next: () => {
        this.mikrotiks = this.mikrotiks.filter(x => x.id !== m.id);
      },
      error: (err) => this.handleError(err, 'Delete Mikrotik')
    });
  }

  /**
   * User management: activate/deactivate user
   */
  toggleUserActive(user: any): void {
    const newStatus = !user.is_active;
    if (!confirm(`${newStatus ? 'Activate' : 'Deactivate'} ${user.username}?`)) return;

    this.apiService.updateUser(user.id, { is_active: newStatus }).subscribe({
      next: (updated) => {
        const idx = this.users.findIndex(u => u.id === user.id);
        if (idx > -1) this.users[idx] = { ...this.users[idx], ...updated };
      },
      error: (err) => this.handleError(err, 'Toggle User Active')
    });
  }

  /**
   * Logout the user and clear local storage
   */
  logout(): void {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}
