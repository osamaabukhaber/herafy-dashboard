import { TestBed } from '@angular/core/testing';

import { SiderbarService } from './siderbar-service';

describe('SiderbarService', () => {
  let service: SiderbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiderbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
