import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Login } from './login/login';
import { Billing } from './billing/billing';
import { Mikrotik } from './mikrotik/mikrotik';
import { Users } from './users/users';

export const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'login', component: Login },
  { path: 'billing', component: Billing },
  { path: 'mikrotik', component: Mikrotik },
  { path: 'users', component: Users },
  { path: '**', redirectTo: '' }
];