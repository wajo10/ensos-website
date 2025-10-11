import { Injectable } from '@angular/core';
import {filter} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';
import {AppAnalytics} from './analytics';

const NAV_OFFSET = 86;

@Injectable({
  providedIn: 'root'
})
export class ScrollTo {
  constructor(private router: Router, private ga: AppAnalytics) {}

  async go(fragment: string, useOffset = true, from:string | null = null) {
    if (from) {
      this.ga.event('scroll_to', {
        category: 'navigation',
        from,
        to: fragment
      });
    }
    const baseUrl = this.router.url.split('#')[0]; // ruta sin fragmento

    const scrollToId = (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      const y = el.getBoundingClientRect().top + window.scrollY - (useOffset ? NAV_OFFSET : 0);
      window.scrollTo({ top: y, behavior: 'smooth' });
    };

    if (baseUrl.includes("home")) {
      scrollToId(fragment);
    } else {
      const navEnded = this.router.events.pipe(filter(e => e instanceof NavigationEnd));
      const once = new Promise<void>(resolve => {
        const s = navEnded.subscribe(() => {
          setTimeout(() => { scrollToId(fragment); resolve(); s.unsubscribe(); }, 0);
        });
      });
      await this.router.navigate(['/'], { fragment });
      await once;
    }
  }



}
