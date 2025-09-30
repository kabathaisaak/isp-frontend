import { Component, OnInit } from '@angular/core';
import { ApiService, HotspotPlan } from '../../shared';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-public-packages',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './public-packages.html',
  styleUrl: './public-packages.css'
})
  export class PublicPackagesComponent implements OnInit {
  plans: HotspotPlan[] = [];
  connectionCode: string | null = null;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.api.getPublicPlans().subscribe({
      next: (data) => (this.plans = data),
      error: (err) => console.error('Error fetching plans', err),
    });
  }

  purchase(planId: string): void {
    const identifier = this.getDeviceIdentifier();

    this.api.purchasePlan(planId, identifier).subscribe({
      next: (res) => {
        this.connectionCode = res.connection_code;
      },
      error: (err) => {
        console.error('Error purchasing plan', err);
        alert('Failed to purchase plan. Please try again.');
      },
    });
  }

  // 🔹 Example way to get identifier (IP or random fallback)
  private getDeviceIdentifier(): string {
    return 'device-' + Math.random().toString(36).substring(2, 10);
  }
}


