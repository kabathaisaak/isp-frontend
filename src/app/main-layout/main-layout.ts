import { Component } from '@angular/core';
import  { Header }  from '../header/header';
import  { Footer }  from '../footer/footer';
import  { Sidebar }  from '../sidebar/sidebar'; 
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [ Header, Footer, Sidebar, CommonModule, RouterOutlet ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {

}
