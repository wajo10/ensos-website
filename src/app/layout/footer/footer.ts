import { Component } from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  imports: [
    NgOptimizedImage,
    TranslatePipe
  ],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {

  scrollToTop() {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
