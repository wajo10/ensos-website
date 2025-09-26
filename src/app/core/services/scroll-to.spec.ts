import { TestBed } from '@angular/core/testing';

import { ScrollTo } from './scroll-to';

describe('ScrollTo', () => {
  let service: ScrollTo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrollTo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
