import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../shared';

@Component({
  selector: 'app-register',
  standalone: true,  // ✅ standalone
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  username = '';
  email = '';
  password = '';
  successMsg = '';
  errorMsg = '';

  constructor(private api: ApiService, private router: Router) {}

  onRegister() {
    console.log('Register button clicked!');
    console.log('Username:', this.username, 'Email:', this.email, 'Password:', this.password);

    // Basic client-side validation
    if (!this.username || this.username.length < 3) {
      this.errorMsg = 'Username must be at least 3 characters.';
      return;
    }
    if (!this.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
      this.errorMsg = 'Please enter a valid email address.';
      return;
    }
    if (!this.password || this.password.length < 6) {
      this.errorMsg = 'Password must be at least 6 characters.';
      return;
    }

    this.errorMsg = '';

    // ✅ Send request to backend
    this.api.register(this.username, this.email, this.password).subscribe({
      next: () => {
        this.successMsg = 'Registration successful! Redirecting to login...';
        console.log('Registration successful');
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        console.error('Registration error:', err);
        this.errorMsg = err.error?.error || 'Registration failed';
      }
    });
  }
}
