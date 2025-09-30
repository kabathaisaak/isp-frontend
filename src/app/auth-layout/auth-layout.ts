import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import  { Header }  from '../header/header';
import  { Footer }  from '../footer/footer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [ Header, Footer, CommonModule, RouterOutlet ],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css'
})
export class AuthLayout {

}
