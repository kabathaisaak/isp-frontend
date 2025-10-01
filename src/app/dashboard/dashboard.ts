import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared';
import { CommonModule, NgIf } from '@angular/common';

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
  username: string | null = null;  // ✅ add username field

  constructor(private apiService: ApiService) {}

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
}
