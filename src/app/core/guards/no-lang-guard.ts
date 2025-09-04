import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class noLangGuard implements CanActivate {
  constructor(private router: Router, private langService: TranslateService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const currentLang = this.langService.getCurrentLang() || 'en';
    const path = route.routeConfig?.path;

    this.router.navigate([currentLang, path]);
    return false; // Block this route and do the redirect
  }
}
