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
  const phoneNumber = prompt("Enter your M-Pesa phone number (format: 2547XXXXXXXX):");

  if (!phoneNumber) {
    alert("Phone number is required.");
    return;
  }

  this.api.mpesaStkPush(planId, phoneNumber).subscribe({
    next: (res) => {
      alert("Payment request sent! Check your phone to enter M-Pesa PIN.");
    },
    error: (err) => {
      console.error("Error initiating payment", err);
      alert("Failed to initiate M-Pesa payment. Please try again.");
    }
  });
}


  // 🔹 Example way to get identifier (IP or random fallback)
  private getDeviceIdentifier(): string {
    return 'device-' + Math.random().toString(36).substring(2, 10);
  }
}


