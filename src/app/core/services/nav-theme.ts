import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type NavTheme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class NavThemeService {
  private _theme$ = new BehaviorSubject<NavTheme>('light');
  readonly theme$ = this._theme$.asObservable();

  setTheme(theme: NavTheme) {
    this._theme$.next(theme);
    console.log(theme);
  }
}
