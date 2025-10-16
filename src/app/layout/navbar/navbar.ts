import {AfterViewInit, Component, HostBinding, HostListener, inject, OnDestroy} from '@angular/core';
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

export class Navbar implements OnDestroy, AfterViewInit {
  @HostBinding('class.dark') isDark = false;
  @HostBinding('class.light') isLight = true;
  @HostBinding('class.scrolled') scrolled = false;
  @HostBinding('class.menu-open') mobileMenuOpen = false;
  @HostBinding('class.desktop-menu-open') desktopMenuOpen = false;
  private previousColorScheme: 'dark' | 'light' | null = null;
  protected currentLang = 'en';


  private sub: Subscription;
  private translate = inject(TranslateService, { optional: true });
  constructor(theme: NavThemeService,
              private router: Router,
              private scrollService: ScrollTo,
  ) {
    this.sub = theme.theme$.subscribe(t => {
      this.isDark = (t === 'dark');
      this.isLight = (t === 'light');
    });
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => this.closeMenu());
  }

  ngAfterViewInit() {
    const svc = this.translate;
    if (!svc) {
      return;
    }
    this.currentLang = (svc as any).getCurrentLang?.() ?? svc.currentLang ?? 'en';
  }

  @HostListener('window:scroll', [])
  onScroll() {
    this.scrolled = typeof window !== 'undefined' && window.scrollY > 10;
  }

  @HostListener('document:click', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  onDocumentPointer(event: Event) {
    if (!this.mobileMenuOpen && !this.desktopMenuOpen) return;

    const target = event.target as HTMLElement | null;
    const path = (event as any).composedPath?.() as EventTarget[] | undefined;

    const clickedToggle =
      !!target?.closest('[data-menu-toggle]') ||
      (path ? path.some(n => (n as Element)?.hasAttribute?.('data-menu-toggle')) : false);

    if (clickedToggle) return;

    const clickedInsideMenu =
      !!target?.closest('[data-menu-root]') ||
      (path ? path.some(n => (n as Element)?.hasAttribute?.('data-menu-root')) : false);

    if (!clickedInsideMenu) {
      this.closeMenu();
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  toggleDesktopMenu() {
    this.desktopMenuOpen = !this.desktopMenuOpen;
    if( this.desktopMenuOpen ){
      this.previousColorScheme = this.isDark ? 'dark' : 'light';
      this.isDark = true;
    }
    else if( this.previousColorScheme ){
      this.isDark = (this.previousColorScheme === 'dark');
      this.previousColorScheme = null;
    }
    this.lockScroll(this.desktopMenuOpen);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.lockScroll(this.mobileMenuOpen);
  }

  closeMobileMenu() {
    if (!this.mobileMenuOpen) return;
    this.mobileMenuOpen = false;
    this.lockScroll(false);
  }

  closeMenu() {
    if (!this.mobileMenuOpen && !this.desktopMenuOpen) return;
    this.desktopMenuOpen = false;
    if( this.previousColorScheme ){
      this.isDark = (this.previousColorScheme === 'dark');
      this.previousColorScheme = null;
    }
    this.lockScroll(false);
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    this.closeMenu();
  }
  async go(fragment: string) {
    await this.scrollService.go(fragment, true, "navbar");
    this.closeMobileMenu() ;
  }

  openReserve() {
    window.open(OPEN_TABLE_URL, '_blank', 'noopener');
  }

  setLanguage(lang: string) {
    if (!this.translate) return;
    this.translate.use(lang);
    this.currentLang = lang;

    // Change the URL to include the language code
    const urlSegments = this.router.url.split('/');
    if (urlSegments[1] === 'en' || urlSegments[1] === 'es') {
      urlSegments[1] = lang;
    } else {
      urlSegments.splice(1, 0, lang);
    }
    const newUrl = urlSegments.join('/');
    this.router.navigateByUrl(newUrl);
    this.closeMenu();
    this.closeMobileMenu();
  }

  private lockScroll(lock: boolean) {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = lock ? 'hidden' : '';
    document.body.style.touchAction = lock ? 'none' : '';
  }



}
