import { TestBed, async, inject } from '@angular/core/testing';

import { MessAuthGuard } from './mess-auth.guard';

describe('MessAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessAuthGuard]
    });
  });

  it('should ...', inject([MessAuthGuard], (guard: MessAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
