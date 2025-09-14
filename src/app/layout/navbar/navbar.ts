import {Component, HostBinding, HostListener, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import { RouterModule } from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {NavThemeService} from '../../core/services/nav-theme';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar implements OnDestroy{
  @HostBinding('class.dark') isDark = false;
  @HostBinding('class.light') isLight = true;
  @HostBinding('class.scrolled') scrolled = false;

  private sub: Subscription;
  constructor(theme: NavThemeService) {
    this.sub = theme.theme$.subscribe(t => {
      this.isDark = (t === 'dark');
      this.isLight = (t === 'light');
    });
  }

  @HostListener('window:scroll', [])
  onScroll() {
    this.scrolled = typeof window !== 'undefined' && window.scrollY > 10;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
