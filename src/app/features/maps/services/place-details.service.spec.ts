import { TestBed } from '@angular/core/testing';

import { PlaceDetailsService } from './place-details.service';
import { Place } from '../models/place.interface';

describe('PlaceDetailsService', () => {
  let service: PlaceDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlaceDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return full details array when all fields are present', () => {
    const place: Partial<Place> = {
      address: [{
        streetAddress: '123 Main St',
        addressRegion: 'California',
        postalCode: '90210'
      }],
      telephone: '+123456789',
      url: 'https://example.com'
    };

    const result = service.getDetailsArray(place as Place);

    expect(result).toEqual([
      { label: 'Street Address', value: '123 Main St', type: 'text' },
      { label: 'County', value: 'California', type: 'text' },
      { label: 'Postal Code', value: '90210', type: 'text' },
      { label: 'Phone number', value: '+123456789', type: 'text' },
      { label: 'Visit website', value: 'https://example.com', type: 'link' }
    ]);
  });

  it('should return only existing fields', () => {
    const place: Partial<Place> = {
      address: [{
        streetAddress: '123 Main St'
      }],
      url: 'https://example.com'
    };

    const result = service.getDetailsArray(place as Place);

    expect(result).toEqual([
      { label: 'Street Address', value: '123 Main St', type: 'text' },
      { label: 'Visit website', value: 'https://example.com', type: 'link' }
    ]);
  });

  it('should return empty array if no details are available', () => {
    const result = service.getDetailsArray({} as Place);
    expect(result).toEqual([]);
  });
});
