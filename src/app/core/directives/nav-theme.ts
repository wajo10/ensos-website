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
  /** Tema que debe aplicarse cuando esta sección queda bajo el navbar */
  @Input('navTheme') theme: NavTheme = 'light';
  /** Altura del navbar (px) => línea de disparo */
  @Input() navThemeOffset = 132;
  /** Activa marcadores visuales para debug */
  @Input() navThemeDebug = false;

  private io?: IntersectionObserver;
  private sentinel?: HTMLElement;
  private debugLabel?: HTMLElement;

  constructor(
    private el: ElementRef<HTMLElement>,
    private r: Renderer2,
    private navTheme: NavThemeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const host = this.el.nativeElement;

    // Asegura posicionamiento relativo para sentinela absoluto
    const cs = getComputedStyle(host);
    if (cs.position === 'static') {
      this.r.setStyle(host, 'position', 'relative');
    }

    // --- Sentinela en el TOP de la sección ---
    const s = this.r.createElement('span') as HTMLElement;
    this.r.setStyle(s, 'position', 'absolute');
    this.r.setStyle(s, 'top', '0px');
    this.r.setStyle(s, 'left', '0px');
    this.r.setStyle(s, 'width', '1px');
    this.r.setStyle(s, 'height', '1px');
    this.r.setStyle(s, 'pointer-events', 'none');
    this.r.setAttribute(s, 'aria-hidden', 'true');
    this.r.addClass(s, 'nav-theme-sentinel');
    this.r.appendChild(host, s);
    this.sentinel = s;

    // --- Marcadores de debug (opcional) ---
    if (this.navThemeDebug) {
      this.ensureTriggerLine(this.navThemeOffset);         // Línea fija global a 132px
      this.decorateHost(host, this.theme);                  // Borde de sección y etiqueta
      this.decorateSentinel(s);                             // Cuadradito magenta en el top

      // Log inicial del estado geométrico
      const rect = host.getBoundingClientRect();
      // eslint-disable-next-line no-console
      console.debug('[navTheme DEBUG:init]', {
        theme: this.theme, top: rect.top, bottom: rect.bottom, offset: this.navThemeOffset
      });
    }

    // --- IO: disparamos cuando el TOP de la sección cruza la línea de navbar ---
    const band = 1; // alto de la banda (1px)
    const computeRootMargin = () => {
      const vh = window.visualViewport?.height ?? window.innerHeight;
      const top = -this.navThemeOffset;
      const bottom = -(vh - this.navThemeOffset - band);
      return `${top}px 0px ${bottom}px 0px`;
    };

    const cb: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        if (this.navThemeDebug) {
          console.debug('[navTheme DEBUG:IO]', {
            theme: this.theme,
            isIntersecting: entry.isIntersecting,
            sentinelTop: entry.boundingClientRect.top,
            rootTop: entry.rootBounds?.top,
            rootHeight: entry.rootBounds?.height,
            navThemeOffset: this.navThemeOffset
          });
        }
        if (entry.isIntersecting) {
          this.navTheme.setTheme(this.theme);
          if (this.navThemeDebug) this.setActiveBadge(true);
        } else if (this.navThemeDebug) {
          this.setActiveBadge(false);
        }
      }
    };

// crea/actualiza el observer para respetar cambios de viewport
    const createObserver = () => {
      this.io?.disconnect();
      this.io = new IntersectionObserver(cb, {
        root: null,
        threshold: 0,                    // con 1×1px basta con tocar la banda
        rootMargin: computeRootMargin(), // banda de 1px a navThemeOffset
      });
      this.io.observe(this.sentinel!);
    };

    createObserver();
    window.addEventListener('resize', createObserver, { passive: true });

    this.io?.observe(s);

    // Evaluación inicial por si cargamos ya scrolleados:
    const hostRect = host.getBoundingClientRect();
    if (hostRect.top <= this.navThemeOffset && hostRect.bottom > this.navThemeOffset) {
      this.navTheme.setTheme(this.theme);
      if (this.navThemeDebug) this.setActiveBadge(true);
    }
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
    if (this.sentinel) {
      try { this.r.removeChild(this.el.nativeElement, this.sentinel); } catch {}
    }
    if (this.debugLabel) {
      try { this.r.removeChild(this.el.nativeElement, this.debugLabel); } catch {}
    }
  }

  // ===== Helpers de debug visual =====

  /** Línea fija global a navThemeOffset px del top (una sola para toda la página) */
  private ensureTriggerLine(offset: number) {
    const id = 'nav-theme-trigger-line';
    if (document.getElementById(id)) return;

    const line = this.r.createElement('div');
    this.r.setAttribute(line, 'id', id);
    this.r.setStyle(line, 'position', 'fixed');
    this.r.setStyle(line, 'top', `${offset}px`);
    this.r.setStyle(line, 'left', '0');
    this.r.setStyle(line, 'right', '0');
    this.r.setStyle(line, 'height', '0');
    this.r.setStyle(line, 'border-top', '2px dashed #ff4d4f'); // rojo
    this.r.setStyle(line, 'z-index', '99999');
    this.r.setStyle(line, 'pointer-events', 'none');
    this.r.appendChild(document.body, line);

    const chip = this.r.createElement('div');
    this.r.setStyle(chip, 'position', 'fixed');
    this.r.setStyle(chip, 'top', `${Math.max(0, offset - 20)}px`);
    this.r.setStyle(chip, 'left', '8px');
    this.r.setStyle(chip, 'padding', '2px 6px');
    this.r.setStyle(chip, 'border-radius', '6px');
    this.r.setStyle(chip, 'font', '12px/1.6 system-ui, sans-serif');
    this.r.setStyle(chip, 'background', '#ff4d4f');
    this.r.setStyle(chip, 'color', '#fff');
    this.r.setStyle(chip, 'z-index', '100000');
    this.r.setStyle(chip, 'pointer-events', 'none');
    chip.textContent = `trigger @ ${offset}px`;
    this.r.appendChild(document.body, chip);
  }

  /** Borde y rótulo para la sección */
  private decorateHost(host: HTMLElement, theme: NavTheme) {
    this.r.setStyle(host, 'outline', theme === 'dark' ? '1px dashed #6ea8fe' : '1px dashed #45c3a5');
    this.r.setStyle(host, 'outline-offset', '0');

    const tag = this.r.createElement('div');
    this.r.setStyle(tag, 'position', 'absolute');
    this.r.setStyle(tag, 'top', '0');
    this.r.setStyle(tag, 'left', '8px');
    this.r.setStyle(tag, 'transform', 'translateY(-100%)');
    this.r.setStyle(tag, 'padding', '2px 6px');
    this.r.setStyle(tag, 'border-radius', '6px');
    this.r.setStyle(tag, 'font', '12px/1.6 system-ui, sans-serif');
    this.r.setStyle(tag, 'background', theme === 'dark' ? '#6ea8fe' : '#45c3a5');
    this.r.setStyle(tag, 'color', '#0b0b0b');
    this.r.setStyle(tag, 'pointer-events', 'none');
    tag.textContent = `section: ${theme}`;
    this.r.appendChild(host, tag);
    this.debugLabel = tag;
  }

  /** Cuadrado visible en el TOP (sentinela) */
  private decorateSentinel(s: HTMLElement) {
    this.r.setStyle(s, 'width', '8px');
    this.r.setStyle(s, 'height', '8px');
    this.r.setStyle(s, 'background', '#ff00aa'); // magenta
    this.r.setStyle(s, 'box-shadow', '0 0 0 2px rgba(255,0,170,0.35)');
    this.r.setStyle(s, 'border-radius', '2px');
  }

  /** Marca visual cuando esta sección está “activa” (su TOP cruzó la línea) */
  private setActiveBadge(active: boolean) {
    if (!this.debugLabel) return;
    this.r.setStyle(this.debugLabel, 'box-shadow', active ? '0 0 0 2px #ff4d4f inset' : 'none');
    this.debugLabel.textContent = `section: ${this.theme}${active ? ' (ACTIVE)' : ''}`;
  }
}
