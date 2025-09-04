import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { languageResolver } from './language-resolver';

describe('languageResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => languageResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
