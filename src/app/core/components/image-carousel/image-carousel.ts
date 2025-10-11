import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  PLATFORM_ID
} from '@angular/core';
import {CommonModule, isPlatformBrowser, NgOptimizedImage} from '@angular/common';
import {AppAnalytics} from '../../services/analytics';

export interface CarouselImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

@Component({
  selector: 'app-image-carousel',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './image-carousel.html',
  styleUrl: './image-carousel.scss'
})
export class ImageCarousel implements AfterViewInit, OnDestroy {
  @Input() images: CarouselImage[] = [];
  @Input() autoplay = true;
  @Input() interval = 5000;           // ms
  @Input() pauseOnHover = true;
  @Input() startIndex = 0;
  @Input() loop = true;
  @Input() height = 420; // px
  @Input() margin = 100;  // px

  @HostBinding('attr.role') role = 'region';
  @HostBinding('attr.aria-roledescription') rd = 'carousel';
  @HostBinding('attr.aria-label') label = 'image carousel';

  current = 0;
  // === Swipe state ===
  dragging = false;
  private timerId: any = null;
  private isBrowser = false;
  private reducedMotion = false;
  private startX = 0;
  private startY = 0;
  private startTime = 0;
  private width = 1;            // ancho del carrusel para convertir px->%
  private axisLocked: 'x' | 'y' | null = null;
  private dragOffsetPx = 0;

  constructor(@Inject(PLATFORM_ID) platformId: Object, private cdr: ChangeDetectorRef, private ga: AppAnalytics) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  get trackTransform(): string {
    const dragPct = (this.dragOffsetPx / Math.max(1, this.width)) * 100;
    const pct = (-100 * this.current) + dragPct;
    return `translate3d(${pct}%, 0, 0)`;
  }

  // === Swipe handlers ===
  onPointerDown(ev: PointerEvent): void {
    if (!this.isBrowser) return;
    // Solo iniciar si hay imágenes
    if (!this.images?.length) return;

    // Permite scroll vertical del navegador (ver CSS: touch-action: pan-y)
    this.width = (ev.currentTarget as HTMLElement).clientWidth || window.innerWidth;
    this.dragging = true;
    this.axisLocked = null;
    this.startX = ev.clientX;
    this.startY = ev.clientY;
    this.startTime = performance.now();
    this.dragOffsetPx = 0;

    // Captura el puntero para seguir recibiendo eventos aunque salga del elemento
    (ev.target as HTMLElement).setPointerCapture?.(ev.pointerId);

    // Pausa autoplay mientras se arrastra
    this.stopAutoplay();
  }

  onPointerMove(ev: PointerEvent): void {
    if (!this.dragging) return;

    const dx = ev.clientX - this.startX;
    const dy = ev.clientY - this.startY;

    // Bloqueo de eje: decide si el gesto es horizontal o vertical
    if (this.axisLocked === null) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return; // pequeño “dead zone”
      this.axisLocked = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    }
    if (this.axisLocked === 'y') {
      // gesto vertical: abandonar drag para no bloquear scroll de página
      this.dragging = false;
      this.dragOffsetPx = 0;
      return;
    }

    // Actualiza desplazamiento horizontal en px
    this.dragOffsetPx = dx;
    this.cdr.markForCheck();
  }

  onPointerUp(ev: PointerEvent): void {
    if (!this.dragging) return;

    this.dragging = false;
    (ev.target as HTMLElement).releasePointerCapture?.(ev.pointerId);

    const dx = ev.clientX - this.startX;
    const dt = Math.max(1, performance.now() - this.startTime); // ms
    const velocity = Math.abs(dx) / dt; // px/ms

    const threshold = this.width * 0.20; // 20% del ancho
    const shouldSlide = Math.abs(dx) > threshold || velocity > 0.5;

    if (shouldSlide) {
      if (dx < 0) this.next(); else this.prev();
      this.ga.event('carousel_slide_manual', {
        index: this.current,
        src: this.images[this.current]?.src,
        component: 'home'
      })
    }

    this.dragOffsetPx = 0;
    this.axisLocked = null;
    this.cdr.markForCheck();
    this.restartAutoplayIfNeeded();
  }


  ngAfterViewInit(): void {
    this.current = Math.min(Math.max(0, this.startIndex), this.images.length - 1);
    if (this.isBrowser) {
      this.reducedMotion = typeof window !== 'undefined'
        && !!window.matchMedia
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (this.autoplay && !this.reducedMotion) {
        this.startAutoplay();
      }
    }
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  // Controls
  next(): void {
    if (!this.images.length) return;
    if (this.current < this.images.length - 1) {
      this.current++;
    } else if (this.loop) {
      this.current = 0;
    }
    this.cdr.detectChanges();
    this.ga.event('carousel_slide', {
      index: this.current,
      src: this.images[this.current]?.src,
      component: 'home'
    })
    this.restartAutoplayIfNeeded();
  }

  prev(): void {
    if (!this.images.length) return;
    if (this.current > 0) {
      this.current--;
    } else if (this.loop) {
      this.current = this.images.length - 1;
    }
    this.ga.event('carousel_prev', {
      index: this.current,
      src: this.images[this.current]?.src,
      component: 'home'
    })
    this.restartAutoplayIfNeeded();
  }

  goTo(i: number): void {
    if (i < 0 || i >= this.images.length) return;
    this.current = i;
    this.restartAutoplayIfNeeded();
    this.ga.event('carousel_go_to', {
      index: this.current,
      src: this.images[this.current]?.src,
      component: 'home'
    });
  }

  // Autoplay
  onMouseEnter(): void {
    if (this.pauseOnHover) this.stopAutoplay();
  }

  onMouseLeave(): void {
    if (this.pauseOnHover && this.autoplay && !this.reducedMotion) {
      this.startAutoplay();
    }
  }

  private startAutoplay(): void {
    this.stopAutoplay();
    this.timerId = setInterval(() => this.next(), this.interval);
  }

  private stopAutoplay(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  private restartAutoplayIfNeeded(): void {
    if (this.autoplay && !this.reducedMotion) {
      this.startAutoplay();
    }
  }
}
