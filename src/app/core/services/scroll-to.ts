import { Injectable } from '@angular/core';
import {filter} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';

const NAV_OFFSET = 132;

@Injectable({
  providedIn: 'root'
})
export class ScrollTo {
  constructor(private router: Router) {}

  async go(fragment: string, useOffset = true) {
    const baseUrl = this.router.url.split('#')[0]; // ruta sin fragmento

    const scrollToId = (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      const y = el.getBoundingClientRect().top + window.scrollY - (useOffset ? NAV_OFFSET : 0);
      window.scrollTo({ top: y, behavior: 'smooth' });
    };

    if (baseUrl === '/' || baseUrl === '') {
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
