import { Component, HostBinding, HostListener } from '@angular/core';
import {CommonModule} from '@angular/common';
import { RouterModule } from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  constructor(translate: TranslateService) {
    console.log(translate.getCurrentLang())
  }
  @HostBinding('class.scrolled') scrolled = false;

  @HostListener('window:scroll', [])
  onScroll() {
    this.scrolled = typeof window !== 'undefined' && window.scrollY > 10;
  }

}
