import {Navbar} from './layout/navbar/navbar';
import {Footer} from './layout/footer/footer';
import {DomSanitizer} from '@angular/platform-browser';
import { Component, Inject, PLATFORM_ID, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import {MatIconRegistry} from '@angular/material/icon';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs';
import {AppAnalytics} from './core/services/analytics';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('enso');
  private readonly SUPPORTED = ['es', 'en'] as const;
  constructor( private matIconRegistry: MatIconRegistry,
               private domSanitizer: DomSanitizer,
               private translate: TranslateService,
               private router: Router,
               private ga: AppAnalytics,
               @Inject(DOCUMENT) private document: Document,
               @Inject(PLATFORM_ID) private platformId: Object) {
    // if (isPlatformBrowser(this.platformId)) {
    //   const nav = navigator.languages?.[0] || navigator.language;
    //   const lang = nav.split('-')[0];
    //   this.translate.use(['es','en'].includes(lang) ? lang : 'es');
    // }
    this.translate.addLangs(this.SUPPORTED as unknown as string[]);
    this.translate.setFallbackLang('es');

    // 1) Al iniciar: usa el idioma del URL si existe; si no, usa guardado o navegador
    const urlLang = this.document?.location?.pathname?.split('/')?.[1];
    const stored = isPlatformBrowser(this.platformId) ? localStorage.getItem('lang') : null;
    const browser = isPlatformBrowser(this.platformId)
      ? (navigator.languages?.[0] || navigator.language || 'es').split('-')[0]
      : 'es';

    const initial =
      this.SUPPORTED.includes(urlLang as any) ? urlLang :
        (this.SUPPORTED.includes(stored as any) ? stored :
          (this.SUPPORTED.includes(browser as any) ? browser : 'es'));

    this.applyLang(initial!);

    // Si el URL no traía lang, redirige a uno con lang
    if (!this.SUPPORTED.includes(urlLang as any)) {
      const rest = this.document.location.pathname.split('/').slice(1).join('/');
      const normalized = ['/', initial, rest].join('/').replace(/\/+/g, '/');
      this.router.navigateByUrl(normalized);
    }

    // 2) En cada navegación: sincroniza Translate con el primer segmento /:lang
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe(e => {
      const lang = e.urlAfterRedirects.split('/')[1];
      if (this.SUPPORTED.includes(lang as any) && lang !== this.translate.getCurrentLang()) {
        this.applyLang(lang);
      }
    });


  }
  private applyLang(lang: string) {
    this.translate.use(lang);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('lang', lang);
      this.document.documentElement.lang = lang;
    }
  }
  openWhatsApp() {
    this.ga.event('click_outbound', {
      category: 'outbound-whatsapp',
      url: "https://wa.me/50663182593?text=Hola! Quiero obtener más información y realizar una reservación",
      text: "Facebook"
    });
    window.open("https://wa.me/50663182593?text=Hola! Quiero obtener más información y realizar una reservación", '_blank', 'noopener');
  }
}
