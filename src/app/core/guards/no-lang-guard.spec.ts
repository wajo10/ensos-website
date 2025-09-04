import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { noLangGuard } from './no-lang-guard';

describe('noLangGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => noLangGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
