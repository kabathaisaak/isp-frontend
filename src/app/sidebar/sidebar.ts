import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],  // ✅ Add RouterModule to use routerLink & routerLinkActive
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {}
