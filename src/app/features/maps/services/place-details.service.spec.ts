import { TestBed } from '@angular/core/testing';

import { PlaceDetailsService } from './place-details.service';

describe('PlaceDetailsService', () => {
  let service: PlaceDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlaceDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
