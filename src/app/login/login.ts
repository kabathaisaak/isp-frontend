import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../shared';

interface LoginResponse {
  access?: string;
  refresh?: string;
  user?: {
    id: number;
    username: string;
    role?: string; // e.g., "admin", "reseller", "subscriber"
  };
  message?: string;
  error?: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMsg = '';
  loading = false;

  constructor(private api: ApiService, private router: Router) {}

  onLogin() {
    if (!this.username || !this.password) return;
    this.loading = true;

    this.api.login(this.username, this.password).subscribe({
      next: (res: LoginResponse) => {
        this.loading = false;

        if (res.access && res.user) {
          // ✅ Save tokens & user info in localStorage
          localStorage.setItem('access', res.access);
          if (res.refresh) localStorage.setItem('refresh', res.refresh);
          localStorage.setItem('username', res.user.username);
          if (res.user.role) localStorage.setItem('role', res.user.role);

          this.errorMsg = '';

          // ✅ Redirect based on role
          switch (res.user.role) {
            case 'admin':
              this.router.navigate(['/dashboard']);
              break;
            case 'reseller':
              this.router.navigate(['/reseller-dashboard']);
              break;
            case 'subscriber':
              this.router.navigate(['/packages']);
              break;
            default:
              this.router.navigate(['/dashboard']);
          }
        } else {
          this.errorMsg = res.error || 'Invalid login response';
        }
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Login failed:', err);
        this.errorMsg = 'Invalid username or password.';
      }
    });
  }

  onRegister() {
    this.router.navigate(['/Register']);
  }
}
