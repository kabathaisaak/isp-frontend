import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../shared';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register implements OnInit {
  username = '';
  password = '';
  successMsg = '';
  errorMsg = '';
  adminExists = false;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    // ✅ Check from backend if admin already exists
    this.api.checkAdminExists().subscribe({
      next: (res) => {
        this.adminExists = res.exists;
        if (this.adminExists) {
          // Redirect to packages page if admin already exists
          this.router.navigate(['/packages']);
        }
      },
      error: (err) => {
        console.error('Error checking admin:', err);
      }
    });
  }

  onRegister() {
    if (this.adminExists) {
      this.errorMsg = 'An admin account already exists.';
      return;
    }

    if (!this.username || this.username.length < 3) {
      this.errorMsg = 'Username must be at least 3 characters.';
      return;
    }
    if (!this.password || this.password.length < 6) {
      this.errorMsg = 'Password must be at least 6 characters.';
      return;
    }

    this.errorMsg = '';

    // ✅ Register only admin (first-time setup)
    this.api.registerAdmin(this.username, this.password).subscribe({
      next: () => {
        this.successMsg = 'Admin account created! Redirecting to login...';
        console.log('Admin registered');
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        console.error('Registration error:', err);
        this.errorMsg = err.error?.error || 'Registration failed';
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
