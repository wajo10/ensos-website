import {
  APP_INITIALIZER,
  ApplicationConfig,
  inject, PLATFORM_ID,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import {provideRouter, withInMemoryScrolling} from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {provideTranslateService, TranslateLoader} from '@ngx-translate/core';
import {provideTranslateHttpLoader} from '@ngx-translate/http-loader';
import {provideHttpClient, withFetch} from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import {isPlatformBrowser} from '@angular/common';
import {filter} from 'rxjs';


function initFirebaseAnalytics() {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  return async () => {
    if (!isPlatformBrowser(platformId)) return;

    const { firebaseConfig } = await import('../environments/firebase-config');
    const { getApps, initializeApp } = await import('firebase/app');
    const app = getApps()[0] ?? initializeApp(firebaseConfig);

    const { getAnalytics, isSupported, setAnalyticsCollectionEnabled, logEvent } =
      await import('firebase/analytics');

    if (await isSupported()) {
      const analytics = getAnalytics(app);
      setAnalyticsCollectionEnabled(analytics, true);

      // page_view en cada navegación SPA
      router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
        logEvent(analytics, 'page_view', {
          page_location: location.href,
          page_path: location.pathname + location.search + location.hash,
          page_title: document.title
        });
      });
    }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withInMemoryScrolling(
      {
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled'
      }
    )), provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    { provide: APP_INITIALIZER, multi: true, useFactory: initFirebaseAnalytics },
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/i18n/',
        suffix: '.json'
      }),
      fallbackLang: 'es',
      lang: 'en'
    })
  ]
};
