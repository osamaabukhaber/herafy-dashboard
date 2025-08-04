import { TestBed } from '@angular/core/testing';

import { LoginServiceTs } from './login.service.ts';

describe('LoginServiceTs', () => {
  let service: LoginServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
