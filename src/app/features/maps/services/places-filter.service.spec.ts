import { TestBed } from '@angular/core/testing';

import { PlacesFilterService } from './places-filter.service';

describe('PlacesFilterService', () => {
  let service: PlacesFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlacesFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
