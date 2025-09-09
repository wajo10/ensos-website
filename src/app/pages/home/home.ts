import { Component } from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {NavThemeDirective} from '../../core/directives/nav-theme';

@Component({
  selector: 'app-home',
  imports: [
    NgOptimizedImage,
    NavThemeDirective
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
