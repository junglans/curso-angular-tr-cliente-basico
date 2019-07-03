import { TestBed } from '@angular/core/testing';

import { UserGuard } from './userguard.service';

describe('UserGuard', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserGuard = TestBed.get(UserGuard);
    expect(service).toBeTruthy();
  });
});
