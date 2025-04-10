import { TestBed } from '@angular/core/testing';

import { PlacesFilterService } from './places-filter.service';
import { take } from 'rxjs';
import { FiltersFormValue } from '../models/filters-form-value.type';

describe('PlacesFilterService', () => {
  let service: PlacesFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlacesFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit empty object initially', (done) => {
    service.filters$.pipe(take(1)).subscribe(filters => {
      expect(filters).toEqual({});
      done();
    });
  });

  describe('when updateFilters is called', () => {
    it('should update filters with trimmed and lowercased strings', (done) => {
      const filters: Partial<FiltersFormValue> = { county: ' DubLin  ', search: '   cOASt   ' };

      service.updateFilters(filters);

      service.filters$.pipe(take(1)).subscribe(updated => {
        expect(updated).toEqual({ county: 'dublin', search: 'coast' });
        done();
      });
    });

    it('should update filters with tags array', (done) => {
      const filters: Partial<FiltersFormValue> = { tags: ['PARK', 'HIKING'] };

      service.updateFilters(filters);

      service.filters$.pipe(take(1)).subscribe(updated => {
        expect(updated).toEqual({
          tags: 'park,hiking'
        });
        done();
      });
    });

    it('should remove falsy and empty array values', (done) => {
      const filters: Partial<FiltersFormValue> = {
        search: '',
        county: '',
        tags: [],
        streetAddress: 'Street'
      };

      service.updateFilters(filters);

      service.filters$.pipe(take(1)).subscribe(updated => {
        expect(updated).toEqual({ streetAddress: 'street' });
        done();
      });
    });
  })
});
