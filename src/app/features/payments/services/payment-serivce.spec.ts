import { TestBed } from '@angular/core/testing';

import { PaymentSerivce } from './payment-serivce';

describe('PaymentSerivce', () => {
  let service: PaymentSerivce;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentSerivce);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
