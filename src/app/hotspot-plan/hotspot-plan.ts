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
    trialDays: 0,
    autoOn: false
  };

  isCreating = false;
  loading = false;

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
        this.loading = false;
      }
    });
  }

  createPlan() {
    this.api.createHotspotPlan(this.newPlan).subscribe({
      next: (plan) => {
        this.plans.push(plan);
        this.isCreating = false;
        this.resetForm();
      },
      error: (err) => console.error('Error creating plan', err)
    });
  }

  recharge(plan: HotspotPlan) {
    const amount = prompt(`Enter recharge amount for plan "${plan.name}":`);
    if (!amount) return;

    this.api.rechargePlan(plan.id, Number(amount)).subscribe({
      next: () => alert('Plan recharged successfully!'),
      error: (err) => console.error('Recharge failed', err)
    });
  }

  resetForm() {
    this.newPlan = {
      name: '',
      price: 0,
      trialDays: 0,
      autoOn: false
    };
  }
}
