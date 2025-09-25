import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { LoginComponent } from './login/login';
import { Billing } from './billing/billing';
import { MikrotikComponent } from './mikrotik/mikrotik';
import { Users } from './users/users';
import { Register } from './register/register';



export const routes: Routes = [
  { path: '', component: Register},
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: Dashboard },
  { path: 'billing', component: Billing },
  { path: 'mikrotik', component: MikrotikComponent },
  { path: 'users', component: Users },
  { path: '**', redirectTo: '' },
 
];