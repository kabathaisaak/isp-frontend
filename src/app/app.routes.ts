import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { LoginComponent } from './login/login';
import { Billing } from './billing/billing';
import { MikrotikComponent } from './mikrotik/mikrotik';
import { Users } from './users/users';
import { Register } from './register/register';
import { HotspotPlanComponent } from './hotspot-plan/hotspot-plan';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { MainLayout } from './layouts/main-layout/main-layout';
export const routes: Routes = [
  // 🔹 Auth routes (no sidebar)
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: Register },
      { path: '', redirectTo: 'register', pathMatch: 'full' } 
    ]
  },

  // 🔹 Main routes (with sidebar)
  {
    path: '',
    component: MainLayout,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'billing', component: Billing },
      { path: 'mikrotik', component: MikrotikComponent },
      { path: 'users', component: Users },
      { path: 'HotspotPlan', component: HotspotPlanComponent },
    ]
  },

  // Wildcard fallback
  { path: '**', redirectTo: '' }
];
