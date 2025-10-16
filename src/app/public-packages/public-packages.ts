import { Component, OnInit } from '@angular/core';
import { ApiService, HotspotPlan } from '../../shared';
import { CommonModule } from '@angular/common';
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

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('access');
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
