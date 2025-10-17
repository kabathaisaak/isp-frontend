import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ApiService, HotspotPlan } from '../../shared';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-public-packages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './public-packages.html',
  styleUrls: ['./public-packages.css'],
})
export class PackagesComponent implements OnInit {
  packages: HotspotPlan[] = [];
  loading = false;
  error: string | null = null;
  user: any = null;
  isBrowser: boolean;

  constructor(private api: ApiService, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    let token: string | null = null;

    if (this.isBrowser) {
      token = localStorage.getItem('access');
    }

    if (token) {
      this.fetchUser();
    } else {
      this.fetchPublicPackages();
    }
  }

  fetchUser(): void {
    this.api.getMe().subscribe({
      next: (userData) => {
        this.user = userData;
        this.fetchPrivatePackages();
      },
      error: () => {
        this.error = 'Failed to load user info';
        this.fetchPublicPackages();
      },
    });
  }

  fetchPrivatePackages(): void {
    this.loading = true;
    this.api.getHotspotPlans().subscribe({
      next: (data) => {
        this.packages = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load private packages';
        this.loading = false;
      },
    });
  }

  fetchPublicPackages(): void {
    this.loading = true;
    this.api.getPublicPlans().subscribe({
      next: (data) => {
        this.packages = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load public plans';
        this.loading = false;
      },
    });
  }
}
