import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { LoginComponent } from './login/login';
// import { RegisterComponent } from './register/register';
import { Billing } from './billing/billing';
import { MikrotikComponent } from './mikrotik/mikrotik';
import { Users } from './users/users';
import { HotspotPlanComponent } from './hotspot-plan/hotspot-plan';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { MainLayout } from './layouts/main-layout/main-layout';
import { PublicPackagesComponent } from './public-packages/public-packages';
import { AuthGuard } from './auth-guard';
import { Register } from './register/register';

export const routes: Routes = [
  // 🔹 Public routes (no sidebar)
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register',  component : Register},
      { path: 'packages', component: PublicPackagesComponent },
      { path: '', redirectTo: 'packages', pathMatch: 'full' }
    ]
  },

  // 🔹 Protected admin routes (with sidebar, require login)
  {
    path: '',
    component: MainLayout,
    children: [
      { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
      { path: 'billing', component: Billing, canActivate: [AuthGuard] },
      { path: 'mikrotik', component: MikrotikComponent, canActivate: [AuthGuard] },
      { path: 'users', component: Users, canActivate: [AuthGuard] },
      { path: 'HotspotPlan', component: HotspotPlanComponent, canActivate: [AuthGuard] },
    ]
  },

  // 🔹 Wildcard fallback
  { path: '**', redirectTo: 'packages' }
];
