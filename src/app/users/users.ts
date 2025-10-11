import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Customer } from '../../shared';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  loading = false;
  error: string | null = null;
  currentUser: any = null;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.fetchCurrentUser();
  }

  /** Get current logged-in user */
  fetchCurrentUser(): void {
    this.api.getMe().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.fetchUsers();
      },
      error: () => (this.error = 'Failed to load user info'),
    });
  }

  /** Fetch users or customers based on role */
  fetchUsers(): void {
    this.loading = true;
    this.error = null;

    if (this.currentUser?.is_superuser) {
      // Admin: view all users
      this.api.getAllUsers().subscribe({
        next: (data) => {
          this.users = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load users';
          this.loading = false;
        },
      });
    } else if (this.currentUser?.is_reseller) {
      // Reseller: view their customers
      this.api.getResellerCustomers().subscribe({
        next: (data) => {
          this.users = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load customers';
          this.loading = false;
        },
      });
    } else {
      this.error = 'You do not have permission to view this page.';
      this.loading = false;
    }
  }
}