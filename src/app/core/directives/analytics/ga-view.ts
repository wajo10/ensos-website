// app/core/analytics/ga-view.directive.ts
import { AfterViewInit, Directive, ElementRef, Inject, Input, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {AppAnalytics} from '../../services/analytics';

@Directive({
  selector: '[gaView]',
  standalone: true,
})
export class GaViewDirective implements AfterViewInit, OnDestroy {
  /** Nombre del evento (ej: 'section_view', 'gallery_view') */
  @Input('gaView') name = 'section_view';
  @Input() gaParams?: Record<string, any>;
  /** Si true, dispara solo la primera vez que aparece */
  @Input() gaOnce = true;
  /** Porcentaje visible requerido (0..1) */
  @Input() threshold = 0.5;

  private io?: IntersectionObserver;
  private seen = false;
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private el: ElementRef<HTMLElement>,
    private ga: AppAnalytics
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting && (!this.gaOnce || !this.seen)) {
          this.seen = true;
          this.ga.event(this.name, this.gaParams);
        }
      }
    }, { threshold: this.threshold });

    this.io.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
  }
}
