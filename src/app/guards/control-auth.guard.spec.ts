import { TestBed, async, inject } from '@angular/core/testing';

import { ControlAuthGuard } from './control-auth.guard';

describe('ControlAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ControlAuthGuard]
    });
  });

  it('should ...', inject([ControlAuthGuard], (guard: ControlAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
