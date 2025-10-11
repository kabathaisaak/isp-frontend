import { Component, OnInit } from '@angular/core';
import { ApiService, HotspotPlan } from '../../shared';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-public-packages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './public-packages.html',
  styleUrl: './public-packages.css',
})
export class PackagesComponent implements OnInit {
  packages: any[] = [];
  loading = false;
  error: string | null = null;
  user: any = null;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.fetchUser();
  }

  /** Fetch logged-in user info and packages */
  fetchUser(): void {
    this.api.getMe().subscribe({
      next: (userData) => {
        this.user = userData;
        this.fetchPackages();
      },
      error: () => (this.error = 'Failed to load user info'),
    });
  }

  fetchPackages(): void {
    this.loading = true;
    this.error = null;

    // Admin → see all, Reseller → own, Customer → local Mikrotik only
    let endpoint = '';
    if (this.user?.is_superuser) endpoint = 'plans/all/';
    else if (this.user?.is_reseller) endpoint = 'plans/my/';
    else if (this.user?.is_customer) endpoint = 'plans/available/';

    this.api.getPackages(endpoint).subscribe({
      next: (data) => {
        this.packages = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load packages';
        this.loading = false;
      },
    });
  }
}
