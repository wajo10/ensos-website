import {Component, ViewEncapsulation} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {NavThemeDirective} from '../../core/directives/nav-theme';
import {TranslatePipe} from '@ngx-translate/core';
import {ImageCarousel} from '../../core/components/image-carousel/image-carousel';

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


}
