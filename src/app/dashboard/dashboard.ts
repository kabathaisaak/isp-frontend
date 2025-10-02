import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared';
import { CommonModule, NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ CommonModule, NgIf ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  performance: any = {};
  loading = true;
  username: string | null = null;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    // ✅ get username from localStorage
    this.username = localStorage.getItem('username');

    this.apiService.getPerformance().subscribe({
      next: (data) => {
        this.performance = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching performance:', err);
        this.loading = false;
      }
    });
  }

  // ✅ Logout function
  logout() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('username');
    localStorage.removeItem('role');

    this.router.navigate(['/login']);
  }
}
