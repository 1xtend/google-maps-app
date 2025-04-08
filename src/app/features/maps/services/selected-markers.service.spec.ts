import { TestBed } from '@angular/core/testing';

import { SelectedMarkersService } from './selected-markers.service';

describe('SelectedMarkersService', () => {
  let service: SelectedMarkersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectedMarkersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
