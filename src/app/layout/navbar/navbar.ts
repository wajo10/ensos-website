import { Component, HostBinding, HostListener } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  @HostBinding('class.scrolled') scrolled = false;

  @HostListener('window:scroll', [])
  onScroll() {
    this.scrolled = typeof window !== 'undefined' && window.scrollY > 10;
  }

}
