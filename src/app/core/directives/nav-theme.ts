import {
  AfterViewInit, Directive, ElementRef, Inject, Input, OnDestroy, PLATFORM_ID, Renderer2
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavThemeService } from '../services/nav-theme';

export type NavTheme = 'dark' | 'light';

@Directive({
  selector: '[navTheme]',
  standalone: true,
})
export class NavThemeDirective implements AfterViewInit, OnDestroy {
  @Input('navTheme') theme: NavTheme = 'light';
  @Input() navThemeOffset = 132;
  private rafId = 0;

  private onScrollOrResize = () => {
    // throttle con rAF
    if (this.rafId !== 0) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = 0;
      this.checkActive();
    });
  };

  constructor(
    private el: ElementRef<HTMLElement>,
    private r: Renderer2,
    private navTheme: NavThemeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;


    // --- Scroll-spy determinista ---
    window.addEventListener('scroll', this.onScrollOrResize, { passive: true });
    window.addEventListener('resize', this.onScrollOrResize, { passive: true });

    // Evaluación inicial
    this.checkActive();
  }

  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.onScrollOrResize);
      window.removeEventListener('resize', this.onScrollOrResize);
    }

  }

  private checkActive() {
    const host = this.el.nativeElement;
    const rect = host.getBoundingClientRect();
    const y = this.navThemeOffset;

    const active = rect.top <= y && rect.bottom > y;

    if (active) {
      this.navTheme.setTheme(this.theme);
    }
  }
}
