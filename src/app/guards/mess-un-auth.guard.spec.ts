import { TestBed, async, inject } from '@angular/core/testing';

import { MessUnAuthGuard } from './mess-un-auth.guard';

describe('MessUnAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessUnAuthGuard]
    });
  });

  it('should ...', inject([MessUnAuthGuard], (guard: MessUnAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
