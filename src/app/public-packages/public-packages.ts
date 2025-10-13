import { Component, OnInit } from '@angular/core';
import { ApiService, HotspotPlan } from '../../shared';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-public-packages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './public-packages.html',
  styleUrls: ['./public-packages.css'], // ✅ fixed plural name
})
export class PackagesComponent implements OnInit {
  packages: HotspotPlan[] = [];
  loading = false;
  error: string | null = null;
  user: any = null;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.fetchUser();
  }

  /** ✅ Step 1: Fetch logged-in user info */
  fetchUser(): void {
    this.api.getMe().subscribe({
      next: (userData) => {
        this.user = userData;
        this.fetchPackages();
      },
      error: () => (this.error = 'Failed to load user info'),
    });
  }

  /** ✅ Step 2: Fetch packages based on role */
  fetchPackages(): void {
    this.loading = true;
    this.error = null;

    let endpoint = '';

    if (this.user?.is_superuser) {
      endpoint = 'plans/all/';
    } else if (this.user?.is_reseller) {
      endpoint = 'plans/my/';
    } else if (this.user?.is_customer) {
      endpoint = 'plans/available/';
    } else {
      this.error = 'User role not recognized';
      this.loading = false;
      return;
    }

    this.api.getHotspotPlans().subscribe({
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
