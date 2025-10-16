import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { RegisterComponent } from './register/register';
import { LoginComponent } from './login/login';
import { Billing } from './billing/billing';
import { MikrotikComponent } from './mikrotik/mikrotik';
import { HotspotPlanComponent } from './hotspot-plan/hotspot-plan';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { MainLayout } from './layouts/main-layout/main-layout';
import { AuthGuard } from './auth-guard';
import { PackagesComponent } from './public-packages/public-packages';

export const routes: Routes = [
  // 🔹 Public routes
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: 'packages', component: PackagesComponent, canActivate: [AuthGuard] }, // ✅ public
      { path: 'login', component: LoginComponent, canActivate: [AuthGuard] }, // 🚫 logged-in users can't access
      { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] }, // 🚫 logged-in users can't access
      { path: '', redirectTo: 'packages', pathMatch: 'full' },
    ],
  },

  // 🔹 Protected routes
  {
    path: '',
    component: MainLayout,
    children: [
      { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
      { path: 'billing', component: Billing, canActivate: [AuthGuard] },
      { path: 'mikrotik', component: MikrotikComponent, canActivate: [AuthGuard] },
      { path: 'HotspotPlan', component: HotspotPlanComponent, canActivate: [AuthGuard] },
    ],
  },

  // 🔹 Fallback
  { path: '**', redirectTo: 'packages' },
];
