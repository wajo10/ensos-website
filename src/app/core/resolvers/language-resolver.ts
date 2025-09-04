import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import {Meta} from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class languageResolver implements Resolve<boolean> {
  constructor(private translate: TranslateService, private meta:Meta) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<boolean> {
    const lang = route.paramMap.get('lang') || 'en';

    // Switch the translation service to the requested language
    // Wait until the translations are fully loaded
    await firstValueFrom(this.translate.use(lang));
    return true; // SSR will proceed only after translations are loaded
  }
}
