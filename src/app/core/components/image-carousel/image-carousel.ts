import {
  AfterViewInit, Component, Inject, Input, PLATFORM_ID, OnDestroy, HostBinding, ChangeDetectorRef
} from '@angular/core';
import { CommonModule, NgOptimizedImage, isPlatformBrowser } from '@angular/common';

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
  private timerId: any = null;
  private isBrowser = false;
  private reducedMotion = false;

  constructor(@Inject(PLATFORM_ID) platformId: Object, private cdr: ChangeDetectorRef) {
    this.isBrowser = isPlatformBrowser(platformId);
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
    this.restartAutoplayIfNeeded();
  }

  prev(): void {
    if (!this.images.length) return;
    if (this.current > 0) {
      this.current--;
    } else if (this.loop) {
      this.current = this.images.length - 1;
    }
    this.restartAutoplayIfNeeded();
  }

  goTo(i: number): void {
    if (i < 0 || i >= this.images.length) return;
    this.current = i;
    this.restartAutoplayIfNeeded();
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
