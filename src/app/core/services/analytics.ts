import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type GaParams = Record<string, any>;

const firebaseConfig = {
  apiKey: "AIzaSyD-LlcQLYYecgafYjIS9XQCEeaWDe_0uIw",
  authDomain: "enso-restaurante.firebaseapp.com",
  projectId: "enso-restaurante",
  storageBucket: "enso-restaurante.firebasestorage.app",
  messagingSenderId: "871441947825",
  appId: "1:871441947825:web:788c7d27d06944dc621690",
  measurementId: "G-2HZMPDPTWT"
};

@Injectable({ providedIn: 'root' })
export class AppAnalytics {
  private analytics?: import('firebase/analytics').Analytics;
  private initPromise?: Promise<void>;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.initPromise = this.init();
    }
  }

  private async init() {
    const { getApps, initializeApp } = await import('firebase/app');
    const { getAnalytics, isSupported, setAnalyticsCollectionEnabled } = await import('firebase/analytics');

    if (!this.isBrowser) return;
    const apps = getApps();
    const app = apps[0] ?? initializeApp(firebaseConfig);

    if (await isSupported()) {
      this.analytics = getAnalytics(app);
      setAnalyticsCollectionEnabled(this.analytics, true);
    }
  }

  private async ready() {
    await this.initPromise;
    return this.analytics;
  }

  async event(name: string, params?: GaParams) {
    const a = await this.ready();
    if (!a) return;
    const { logEvent } = await import('firebase/analytics');
    logEvent(a, name, params);
  }

  async setUserId(id: string | null) {
    const a = await this.ready();
    if (!a) return;
    const { setUserId } = await import('firebase/analytics');
    setUserId(a, id);
  }

  async setUserProps(props: GaParams) {
    const a = await this.ready();
    if (!a) return;
    const { setUserProperties } = await import('firebase/analytics');
    setUserProperties(a, props);
  }

  async setConsent(consent: Partial<{
    ad_storage: 'granted'|'denied';
    analytics_storage: 'granted'|'denied';
    ad_user_data: 'granted'|'denied';
    ad_personalization: 'granted'|'denied';
  }>) {
    const a = await this.ready();
    if (!a) return;
    const { setConsent } = await import('firebase/analytics');
    setConsent(consent as any);
  }
}
