import { TestBed } from '@angular/core/testing';

import { StoreServices } from './store-services';

describe('StoreServices', () => {
  let service: StoreServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
