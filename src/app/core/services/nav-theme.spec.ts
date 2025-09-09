import { TestBed } from '@angular/core/testing';

import { NavTheme } from './nav-theme';

describe('NavTheme', () => {
  let service: NavTheme;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavTheme);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
