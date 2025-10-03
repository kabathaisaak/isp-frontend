import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../shared';
import { Router } from '@angular/router';

@Component({
  selector: 'app-complete-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // ✅ Add ReactiveFormsModule here
  templateUrl: './complete-profile.html',
  styleUrls: ['./complete-profile.css']
})
export class CompleteProfile {
  profileForm: FormGroup;

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {
    this.profileForm = this.fb.group({
      company_name: ['', Validators.required],
      kra_pin: ['', Validators.required],
      phone: ['', Validators.required],
      registration_cert: [null],
      national_id: [null]
    });
  }

  onFileChange(event: any, field: string) {
    const file = event.target.files[0];
    this.profileForm.patchValue({ [field]: file });
  }

  submitProfile() {
    const formData = new FormData();
    Object.keys(this.profileForm.value).forEach(key => {
      formData.append(key, this.profileForm.value[key]);
    });

    this.api.completeProfile(formData).subscribe({
      next: () => {
        alert('Profile completed! You can now log in.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        alert('Profile completion failed.');
      }
    });
  }
}
