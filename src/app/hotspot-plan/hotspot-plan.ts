import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService, HotspotPlan } from '../../shared';

@Component({
  selector: 'app-hotspot-plan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hotspot-plan.html',
  styleUrls: ['./hotspot-plan.css']
})
export class HotspotPlanComponent implements OnInit {
  plans: HotspotPlan[] = [];
  newPlan: Partial<HotspotPlan> = {
    name: '',
    price: 0,
  };

  isCreating = false;
  loading = false;
  phoneNumber: string = ''; // for recharge input
  recharging: Record<string, boolean> = {}; // track per-plan recharge states

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.fetchPlans();
  }

  // ===============================
  // FETCH PLANS
  // ===============================
  fetchPlans() {
    this.loading = true;
    this.api.getHotspotPlans().subscribe({
      next: (res) => {
        this.plans = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching plans', err);
        this.loading = false;
      },
    });
  }

  // ===============================
  // CREATE NEW PLAN
  // ===============================
  createPlan() {
    if (!this.newPlan.name || !this.newPlan.price) {
      alert('Please enter a plan name and price.');
      return;
    }

    this.api.createHotspotPlan(this.newPlan).subscribe({
      next: (plan) => {
        this.plans.push(plan);
        this.isCreating = false;
        this.resetForm();
      },
      error: (err) => console.error('Error creating plan', err),
    });
  }

  // ===============================
  // RESET FORM
  // ===============================
  resetForm() {
    this.newPlan = {
      name: '',
      price: 0,
    };
  }

  // ===============================
  // RECHARGE VIA MPESA
  // ===============================
  recharge(plan: HotspotPlan) {
    if (!this.phoneNumber) {
      alert('Please enter your M-Pesa phone number.');
      return;
    }

    this.recharging[plan.id] = true;

    this.api.mpesaStkPush(plan.id, this.phoneNumber).subscribe({
      next: (res) => {
        this.recharging[plan.id] = false;
        alert('M-Pesa prompt sent successfully! Check your phone to complete payment.');
      },
      error: (err) => {
        this.recharging[plan.id] = false;
        console.error('Recharge failed:', err);
        alert('Failed to initiate payment. Please try again.');
      },
    });
  }
}
