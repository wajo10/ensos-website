import { Component } from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {ScrollTo} from '../../core/services/scroll-to';
import {RouterLink} from '@angular/router';

const OPEN_TABLE_URL = "https://www.opentable.com/restaurant/profile/1457644/reserve?restref=1457644&lang=en-US&ot_source=Restaurant%20website"

@Component({
  selector: 'app-footer',
  imports: [
    NgOptimizedImage,
    TranslatePipe,
    RouterLink
  ],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {

  constructor(private scrollService: ScrollTo) {
  }

  scrollToTop() {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  async go(fragment: string) {
    await this.scrollService.go(fragment);
  }

  openReserve() {
    window.open(OPEN_TABLE_URL, '_blank', 'noopener');
  }

  openFacebook() {
    window.open("https://www.facebook.com/profile.php?id=61579599815889", '_blank', 'noopener');
  }

  openInstagram() {
    window.open("https://www.instagram.com/enso.restaurante/", '_blank', 'noopener');
  }

  openMaps() {
    window.open("https://maps.app.goo.gl/PAzxzw3heyBZSfqz7", '_blank', 'noopener');
  }

  openWaze() {
    window.open("https://www.waze.com/ul?ll=9.936353746140972%2C-84.14325014255192&navigate=yes&zoom=17", '_blank', 'noopener');
  }

  openWhatsApp() {
    window.open("https://wa.me/50663182593?text=Hola! Quiero obtener más información y realizar una reservación", '_blank', 'noopener');
  }

  openUber(){
    window.open("https://m.uber.com/ul/?client_id=fIjTzj60sDpayi82karQ3ZOfYOL8Z-c_&action=setPickup&pickup=my_location&dropoff%5Blatitude%5D=9.936353746140972&dropoff%5Blongitude%5D=-84.14325014255192", '_blank', 'noopener');
  }

}
