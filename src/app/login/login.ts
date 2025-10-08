import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../shared';

interface LoginResponse {
  message?: string;
  error?: string;
  user?: any;
  access?: string;
  refresh?: string;
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

  constructor(private api: ApiService, private router: Router) {}

  onLogin() {
    this.api.login(this.username, this.password).subscribe({
      next: (res: LoginResponse) => {
        if (res.user && res.access && res.refresh) {
          console.log('User logged in:', res.user);

          // ✅ Save JWT tokens
          localStorage.setItem('access', res.access);
          localStorage.setItem('username', res.user.username); // ✅ save username
          localStorage.setItem('role', res.user.role); // optional: save role if needed
          localStorage.setItem('refresh', res.refresh);

          this.errorMsg = '';

          // ✅ Redirect to dashboard
          this.router.navigate(['/dashboard']);
        } else if (res.error) {
          this.errorMsg = res.error;
        }
      },
      error: (err: any) => {
        console.error('Login failed:', err);
        this.errorMsg = 'Invalid username or password';
      }
    });
  }
   // ✅ Register method (navigates to registration page)
  onRegister() {
    this.router.navigate(['/register']);
  }

  
}
