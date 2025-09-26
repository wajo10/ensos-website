import {Component, HostBinding, HostListener, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavigationEnd, Router, RouterModule} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {filter, Subscription} from 'rxjs';
import {NavThemeService} from '../../core/services/nav-theme';
import {ScrollTo} from '../../core/services/scroll-to';

const OPEN_TABLE_URL = "https://www.opentable.com/restaurant/profile/1457644/reserve?restref=1457644&lang=en-US&ot_source=Restaurant%20website"

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
  @HostBinding('class.menu-open') menuOpen = false;


  private sub: Subscription;
  constructor(theme: NavThemeService, private router: Router, private scrollService: ScrollTo) {
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

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    this.lockScroll(this.menuOpen);
  }

  closeMenu() {
    if (!this.menuOpen) return;
    this.menuOpen = false;
    this.lockScroll(false);
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    this.closeMenu();
  }
  async go(fragment: string) {
    await this.scrollService.go(fragment);
    this.closeMenu();
  }

  openReserve() {
    window.open(OPEN_TABLE_URL, '_blank', 'noopener');
  }

  private lockScroll(lock: boolean) {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = lock ? 'hidden' : '';
    document.body.style.touchAction = lock ? 'none' : '';
  }

}
