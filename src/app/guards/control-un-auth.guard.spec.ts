import { TestBed, async, inject } from '@angular/core/testing';

import { ControlUnAuthGuard } from './control-un-auth.guard';

describe('ControlUnAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ControlUnAuthGuard]
    });
  });

  it('should ...', inject([ControlUnAuthGuard], (guard: ControlUnAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
