import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { metaResolver } from './meta-resolver';

describe('metaResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => metaResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
