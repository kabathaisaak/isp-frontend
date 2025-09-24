import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../shared';

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
      next: (res: { message?: string; error?: string; user?: any }) => {
        if (res.user) {
          console.log('User logged in:', res.user);
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
}
