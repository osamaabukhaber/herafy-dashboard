import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { authStatusResolver } from './auth-status-resolver';

describe('authStatusResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => authStatusResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
