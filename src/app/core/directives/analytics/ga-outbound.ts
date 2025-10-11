import { Directive, HostListener, Input } from '@angular/core';
import {AppAnalytics} from '../../services/analytics';

@Directive({
  selector: 'a[gaOutbound]',
  standalone: true,
})
export class GaOutboundDirective {
  @Input('gaOutbound') category = 'outbound';

  constructor(private ga: AppAnalytics) {}

  @HostListener('click', ['$event'])
  onClick(ev: MouseEvent) {
    const a = ev.currentTarget as HTMLAnchorElement;
    this.ga.event('click_outbound', {
      category: this.category,
      url: a.href,
      text: (a.textContent || '').trim()
    });
  }
}
