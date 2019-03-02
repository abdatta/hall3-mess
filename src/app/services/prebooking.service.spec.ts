import { TestBed, inject } from '@angular/core/testing';

import { PrebookingService } from './prebooking.service';

describe('PrebookingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrebookingService]
    });
  });

  it('should be created', inject([PrebookingService], (service: PrebookingService) => {
    expect(service).toBeTruthy();
  }));
});
