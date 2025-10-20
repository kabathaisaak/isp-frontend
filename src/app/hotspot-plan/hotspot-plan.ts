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
  loading = false;
  error: string | null = null;

  phoneNumber: string = '';
  recharging: Record<string, boolean> = {};
  showModal = false;

  user: any = {
    username: 'Guest',
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.fetchPlans();
  }

  fetchPlans() {
    this.loading = true;
    this.api.getHotspotPlans().subscribe({
      next: (res) => {
        this.plans = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching plans', err);
        this.error = 'Failed to load packages. Please try again later.';
        this.loading = false;
      },
    });
  }

  recharge(plan: HotspotPlan) {
    if (!this.phoneNumber) {
      alert('Please enter your M-Pesa phone number.');
      return;
    }

    this.recharging[plan.id] = true;

    this.api.mpesaStkPush(plan.id, this.phoneNumber).subscribe({
      next: () => {
        this.recharging[plan.id] = false;
        this.showModal = true;
      },
      error: (err) => {
        this.recharging[plan.id] = false;
        console.error('Recharge failed:', err);
        alert('❌ Failed to initiate payment. Please try again.');
      },
    });
  }

  closeModal() {
    this.showModal = false;
    this.phoneNumber = '';
  }
}
