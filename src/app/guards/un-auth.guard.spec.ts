import { TestBed, async, inject } from '@angular/core/testing';

import { UnAuthGuard } from './un-auth.guard';

describe('UnAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnAuthGuard]
    });
  });

  it('should ...', inject([UnAuthGuard], (guard: UnAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
