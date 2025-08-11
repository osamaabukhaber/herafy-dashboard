import { TestBed } from '@angular/core/testing';

import { ReviewServices } from './review-services';

describe('ReviewServices', () => {
  let service: ReviewServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReviewServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
