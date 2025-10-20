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
  // Public routes
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: 'packages', component: PackagesComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: '', redirectTo: 'packages', pathMatch: 'full' },
    ],
  },

  // Protected routes
  {
    path: '',
    component: MainLayout,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'billing', component: Billing },
      { path: 'mikrotik', component: MikrotikComponent },
      { path: 'hotspot-plan', component: HotspotPlanComponent },
    ],
  },

  // Fallback
  { path: '**', redirectTo: 'packages' },
];
