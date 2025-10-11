import {Component, ViewEncapsulation} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {NavThemeDirective} from '../../core/directives/nav-theme';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ImageCarousel} from '../../core/components/image-carousel/image-carousel';
import {ScrollTo} from '../../core/services/scroll-to';
import {GaClickDirective} from '../../core/directives/analytics/ga-click';
import {GaViewDirective} from '../../core/directives/analytics/ga-view';

const OPEN_TABLE_URL = "https://www.opentable.com/restaurant/profile/1457644/reserve?restref=1457644&lang=en-US&ot_source=Restaurant%20website"


@Component({
  selector: 'app-home',
  imports: [
    NgOptimizedImage,
    NavThemeDirective,
    TranslatePipe,
    ImageCarousel,
    GaClickDirective,
    GaViewDirective
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  encapsulation: ViewEncapsulation.None
})
export class Home {
  protected currentLang: string;

  constructor(private scrollService:ScrollTo, private translateService: TranslateService) {
    this.currentLang = this.translateService.getCurrentLang();
  }

  async go(fragment: string, useOffset = true) {
    await this.scrollService.go(fragment, useOffset, "home");
  }

  openReserve() {
    window.open(OPEN_TABLE_URL, '_blank', 'noopener');
  }


}
