import { TestBed } from '@angular/core/testing';

import { EqualityService } from './equality.service';

describe('EqualityService', () => {
  let service: EqualityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EqualityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
