import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ApiService } from '../../shared';
import { PLATFORM_ID, Inject } from '@angular/core';

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
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  errorMsg = '';
  loading = false;

  constructor(
    private api: ApiService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // ✅ Ensure this only runs in the browser
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('access');
      const role = localStorage.getItem('role');

      if (token && role) {
        // 🔹 Auto-redirect if user is already logged in
        switch (role) {
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
      }
    }
  }

onLogin() {
  if (!this.username || !this.password) return;
  this.loading = true;

  this.api.login(this.username, this.password).subscribe({
    next: (res: LoginResponse) => {
      this.loading = false;

      if (res.access && res.user) {
        if (isPlatformBrowser(this.platformId)) {
          // ✅ Save tokens & user info in localStorage
          localStorage.setItem('access', res.access);
          if (res.refresh) localStorage.setItem('refresh', res.refresh);
          localStorage.setItem('username', res.user.username);

          // ✅ Store role correctly from top level
          if ((res as any).role) {
            localStorage.setItem('role', (res as any).role);
          }

          this.errorMsg = '';

          // ✅ Role-based redirect
          const role = (res as any).role;
          switch (role) {
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
