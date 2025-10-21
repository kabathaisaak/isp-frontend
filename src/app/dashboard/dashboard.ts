// src/app/dashboard/dashboard.ts
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ CommonModule, NgIf, NgFor ],
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

  ngOnInit() {
    this.username = localStorage.getItem('username');
    this.loadDashboard();
  }

  loadDashboard() {
    this.loading = true;

    // performance
    this.apiService.getPerformance().subscribe({
      next: (data) => this.performance = data,
      error: (err) => console.error('Performance error', err)
    });

    // packages (admin's)
    this.apiService.getAdminPackages().subscribe({
      next: (data: any) => this.packages = data,
      error: (err) => console.error('Packages error', err)
    });

    // mikrotiks (owner)
    this.apiService.getMyMikrotiks().subscribe({
      next: (data: any) => this.mikrotiks = data,
      error: (err) => console.error('Mikrotiks error', err)
    });

    // users
    this.apiService.getAllUsers().subscribe({
      next: (data: any) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Users error', err);
        this.loading = false;
      }
    });
  }

  // navigation to create pages
  createPackage() {
    this.router.navigate(['/billing/plans/create']); // implement route & component later
  }
  editPackage(pkg: any) {
    this.router.navigate([`/billing/plans/${pkg.id}/edit`]);
  }
  deletePackage(pkg: any) {
    if (!confirm(`Delete package "${pkg.name}"? This cannot be undone.`)) return;
    this.apiService.deleteAdminPackage(pkg.id).subscribe({
      next: () => {
        this.packages = this.packages.filter(p => p.id !== pkg.id);
      },
      error: err => console.error('Delete package error', err)
    });
  }

  // mikrotik CRUD
  createMikrotik() {
    this.router.navigate(['/mikrotik/create']); // implement later
  }
  editMikrotik(m: any) {
    this.router.navigate([`/mikrotik/${m.id}/edit`]);
  }
  deleteMikrotik(m: any) {
    if (!confirm(`Delete mikrotik "${m.name}"?`)) return;
    this.apiService.deleteMikrotik(m.id).subscribe({
      next: () => this.mikrotiks = this.mikrotiks.filter(x => x.id !== m.id),
      error: err => console.error('Delete mikrotik error', err)
    });
  }

  // simple user activation toggle (admin-only)
  toggleUserActive(user: any) {
    const newStatus = !user.is_active;
    if (!confirm(`${newStatus ? 'Activate' : 'Deactivate'} ${user.username}?`)) return;

    this.apiService.updateUser(user.id, { is_active: newStatus }).subscribe({
      next: (updated) => {
        // update local copy
        const idx = this.users.findIndex(u => u.id === user.id);
        if (idx > -1) this.users[idx] = { ...this.users[idx], ...updated };
      },
      error: err => console.error('Toggle user active error', err)
    });
  }

  logout() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}
