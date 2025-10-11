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
export class RegisterComponent implements OnInit {
  step = 1; // Track current step

  // Step 1 – Credentials
  username = '';
  password = '';

  // Step 2 – Profile Info
  fullName = '';
  email = '';
  phone = '';
  kraPin = '';
  businessName = '';
  address = '';
  kycDocs: File | FileList | null = null;


  // UI state
  adminExists = false;
  successMsg = '';
  errorMsg = '';
  loading = false;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.api.checkAdminExists().subscribe({
      next: (res) => {
        this.adminExists = res.exists;
        if (this.adminExists) {
          this.router.navigate(['/login']);
        }
      },
      error: (err) => console.error('Admin check error:', err),
    });
  }

  // ✅ Step 1: Register
  onRegister() {
    if (!this.username || this.username.length < 3) {
      this.errorMsg = 'Username must be at least 3 characters.';
      return;
    }

    if (!this.password || this.password.length < 6) {
      this.errorMsg = 'Password must be at least 6 characters.';
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    this.api.registerAdmin(this.username, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.step = 2; // Move to profile step
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.error || 'Registration failed.';
      },
    });
  }

  // ✅ Step 2: Complete profile
  onCompleteProfile() {
    if (!this.fullName || !this.email || !this.phone) {
      this.errorMsg = 'Please fill in all required fields.';
      return;
    }

    const formData = new FormData();
    formData.append('full_name', this.fullName);
    formData.append('email', this.email);
    formData.append('phone', this.phone);
    formData.append('business_name', this.businessName);
    formData.append('address', this.address);

    this.loading = true;

    this.api.completeProfile(formData).subscribe({
      next: () => {
        this.loading = false;
        this.successMsg = 'Profile completed successfully!';
        this.step = 3; // Move to success step
        setTimeout(() => this.router.navigate(['/dashboard']), 2000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.error || 'Profile completion failed.';
      },
    });
  }

  selectedFiles: { [key: string]: File | FileList } = {};

onFileSelected(event: Event, field: string) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedFiles[field] = field === 'kyc_docs' ? input.files : input.files[0];
  }
}


  goBack() {
    if (this.step > 1) this.step--;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
