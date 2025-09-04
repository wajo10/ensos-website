import {Inject, Injectable} from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {firstValueFrom, forkJoin} from 'rxjs';
import {Meta, Title} from '@angular/platform-browser';
import {DOCUMENT} from '@angular/common';

@Injectable({ providedIn: 'root' })
export class metaResolver implements Resolve<boolean> {
  constructor(@Inject(DOCUMENT) private document: Document,
              private translate: TranslateService,
              private meta:Meta,
              private title: Title) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<boolean> {
    const lang = route.paramMap.get('lang') || 'en';

    const baseUrl = 'https://ensorestaurant.com';

    //Tags for SEO
    const path = route.url.join('/');
    const canonicalUrl = `${baseUrl}/${lang}/${path}`;

    // Different meta tags
    const titleKey = route.data['metaTitleKey'] as string;
    const descKey  = route.data['metaDescriptionKey'] as string;
    const keywordsKey = route.data['metaKeywordsKey'] as string;
    let image    = route.data['metaImage'] as string;

    if (titleKey || descKey || keywordsKey) {
      const translations$ = [];
      if (titleKey) { translations$.push(this.translate.get(titleKey)); }
      if (descKey)  { translations$.push(this.translate.get(descKey)); }
      if (keywordsKey) { translations$.push(this.translate.get(keywordsKey)); }

      const results = await firstValueFrom(forkJoin(translations$));

      const [translatedTitle, translatedDesc, translatedKeyWords] = results;

      if (translatedTitle) {
        this.meta.updateTag({ property: 'og:title', content: translatedTitle });
        this.meta.updateTag({ name: 'title', content: translatedTitle });
        this.meta.updateTag({ name: 'description', content: translatedTitle });
        this.meta.updateTag({ name: 'twitter:title', content: translatedTitle });
        this.title.setTitle('Enso - ' + translatedTitle);
      }
      if (translatedDesc) {
        this.meta.updateTag({ name: 'description', content: translatedDesc });
        this.meta.updateTag({ property: 'og:description', content: translatedDesc });
        this.meta.updateTag({ name: 'twitter:description', content: translatedDesc });
      }

      if (translatedKeyWords) {
        this.meta.updateTag({name: 'keywords', content: translatedKeyWords});
      }
    }
    else{
      this.meta.updateTag({ property: 'og:title', content: 'Enso Restaurant' });
      this.meta.updateTag({ name: 'title', content: 'Enso Restaurant' });
      this.meta.updateTag({ name: 'description', content: 'Enso Restaurant' });
      this.meta.updateTag({ name: 'twitter:title', content: 'Enso Restaurant' });
      this.title.setTitle('Enso - Enso Restaurant');
    }

    // Twitter and Facebook meta tags with image
    this.meta.updateTag({ property: 'og:locale', content: lang });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Enso Restaurant' });

    if(!image){
      image = '/img/jungle_compressor.png';
    }

    // Add the current url to the image
    if (!image.startsWith('http')) {
      image = `${baseUrl}/${image}`;
    }
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:image', content: image });
    this.meta.updateTag({ name: 'twitter:image:alt', content: 'Enso Restaurant' });
    this.meta.updateTag({ name: 'twitter:url', content: canonicalUrl });





    // Canonical URL
    this.meta.updateTag({
      property: "og:url",
      content: canonicalUrl
    });

    const canonicalTag = this.document.querySelector('link[rel="canonical"]');
    if (canonicalTag) {
      canonicalTag.setAttribute('href', canonicalUrl);
    } else {
      const linkTag = this.document.createElement('link');
      linkTag.setAttribute('rel', 'canonical');
      linkTag.setAttribute('href', canonicalUrl);
      this.document.head.appendChild(linkTag);
    }

    return true; // SSR will proceed only after translations are loaded
  }
}
