import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, HotspotPlan } from '../../shared';

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

  // 🔧 Form state
  showForm = false;
  editingPlan: HotspotPlan | null = null;
  formData: Partial<HotspotPlan> = { name: '', price: 0, trial_days: 0, auto_on: false };

  constructor(private api: ApiService, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    const token = this.isBrowser ? localStorage.getItem('access') : null;
    if (token) this.fetchUser();
    else this.fetchPublicPackages();
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
      next: (data: HotspotPlan[]) => {
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
      next: (data: HotspotPlan[]) => {
        this.packages = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load public plans';
        this.loading = false;
      },
    });
  }

  // ✅ Create Form
  openCreateForm(): void {
    this.formData = { name: '', price: 0, trial_days: 0, auto_on: false };
    this.editingPlan = null;
    this.showForm = true;
  }

  // ✅ Edit Form
  openEditForm(plan: HotspotPlan): void {
    this.formData = { ...plan };
    this.editingPlan = plan;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  // ✅ Save Package (Create or Update)
  savePackage(): void {
    if (!this.formData.name || !this.formData.price) {
      this.error = 'Please fill in all required fields.';
      return;
    }

    if (this.editingPlan) {
      this.api.updateAdminPackage(this.editingPlan.id, this.formData).subscribe({
        next: (updated: HotspotPlan) => {
          const idx = this.packages.findIndex((p) => p.id === updated.id);
          if (idx > -1) this.packages[idx] = updated;
          this.closeForm();
        },
        error: () => (this.error = 'Failed to update package'),
      });
    } else {
      this.api.createAdminPackage(this.formData).subscribe({
        next: (created: HotspotPlan) => {
          this.packages.push(created);
          this.closeForm();
        },
        error: () => (this.error = 'Failed to create package'),
      });
    }
  }

  // ✅ Delete a plan
  deletePlan(plan: HotspotPlan): void {
    if (!confirm(`Delete package "${plan.name}"?`)) return;
    this.api.deleteAdminPackage(plan.id).subscribe({
      next: () => {
        this.packages = this.packages.filter((p) => p.id !== plan.id);
      },
      error: () => (this.error = 'Failed to delete package'),
    });
  }
}
