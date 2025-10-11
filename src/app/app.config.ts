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
import { initializeApp } from 'firebase/app';
import {isPlatformBrowser} from '@angular/common';

const firebaseConfig = {
  apiKey: "AIzaSyD-LlcQLYYecgafYjIS9XQCEeaWDe_0uIw",
  authDomain: "enso-restaurante.firebaseapp.com",
  projectId: "enso-restaurante",
  storageBucket: "enso-restaurante.firebasestorage.app",
  messagingSenderId: "871441947825",
  appId: "1:871441947825:web:788c7d27d06944dc621690",
  measurementId: "G-2HZMPDPTWT"
};

function initFirebaseAnalytics() {
  const platformId = inject(PLATFORM_ID);

  return async () => {
    if (!isPlatformBrowser(platformId)) return;

    const app = initializeApp(firebaseConfig);

    // Importa analytics dinámicamente para no cargarlo en SSR
    const { getAnalytics, isSupported, setAnalyticsCollectionEnabled } = await import('firebase/analytics');

    if (await isSupported()) {
      const analytics = getAnalytics(app);
      setAnalyticsCollectionEnabled(analytics, true);
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
