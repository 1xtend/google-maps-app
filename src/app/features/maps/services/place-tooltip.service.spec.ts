import { TestBed } from '@angular/core/testing';

import { PlaceTooltipService } from './place-tooltip.service';

describe('PlaceTooltipService', () => {
  let service: PlaceTooltipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlaceTooltipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
