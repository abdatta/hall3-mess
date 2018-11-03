import { TestBed, inject } from '@angular/core/testing';

import { TokensService } from './tokens.service';

describe('TokensService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TokensService]
    });
  });

  it('should be created', inject([TokensService], (service: TokensService) => {
    expect(service).toBeTruthy();
  }));
});
