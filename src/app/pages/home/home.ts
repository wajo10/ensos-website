import {Component, ViewEncapsulation} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {NavThemeDirective} from '../../core/directives/nav-theme';
import {TranslatePipe} from '@ngx-translate/core';
import {ImageCarousel} from '../../core/components/image-carousel/image-carousel';
import {ScrollTo} from '../../core/services/scroll-to';

const OPEN_TABLE_URL = "https://www.opentable.com/restaurant/profile/1457644/reserve?restref=1457644&lang=en-US&ot_source=Restaurant%20website"


@Component({
  selector: 'app-home',
  imports: [
    NgOptimizedImage,
    NavThemeDirective,
    TranslatePipe,
    ImageCarousel
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  encapsulation: ViewEncapsulation.None
})
export class Home {

  constructor(private scrollService:ScrollTo) {
  }

  async go(fragment: string, useOffset = true) {
    await this.scrollService.go(fragment, useOffset);
  }

  openReserve() {
    window.open(OPEN_TABLE_URL, '_blank', 'noopener');
  }


}
