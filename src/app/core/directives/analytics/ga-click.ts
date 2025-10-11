// app/core/analytics/ga-click.directive.ts
import { Directive, HostListener, Input } from '@angular/core';
import {AppAnalytics} from '../../services/analytics';

@Directive({
  selector: '[gaClick]',
  standalone: true,
})
export class GaClickDirective {
  /** Nombre de evento GA4 (ej: 'select_content', 'cta_click', 'book_experience') */
  @Input('gaClick') name = 'select_content';
  /** Parámetros opcionales */
  @Input() gaParams?: Record<string, any>;

  constructor(private ga: AppAnalytics) {}

  @HostListener('click')
  onClick() {
    this.ga.event(this.name, this.gaParams);
  }
}
