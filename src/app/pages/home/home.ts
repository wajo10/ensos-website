import {Component, ViewEncapsulation} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {NavThemeDirective} from '../../core/directives/nav-theme';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  imports: [
    NgOptimizedImage,
    NavThemeDirective,
    TranslatePipe
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  encapsulation: ViewEncapsulation.None
})
export class Home {

}
