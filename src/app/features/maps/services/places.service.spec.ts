import { TestBed } from '@angular/core/testing';

import { PlacesService } from './places.service';
import { makeStateKey, PLATFORM_ID, TransferState } from '@angular/core';
import { Place } from '../models/place.interface';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { first } from 'rxjs';
import { asAny } from '../../../../testing/test-helpers';

describe('PlacesService', () => {
  let service: PlacesService;
  let httpTestingController: HttpTestingController;
  let transferState: TransferState;

  const mockPlace = { id: '1', name: 'Test Place' } as Place;
  const PLACES_KEY = makeStateKey<Place[]>('places');
  const PLACE_KEY = makeStateKey<Place>('place');

  function configureTestingModule(platform: 'browser' | 'server'): void {
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: platform }, provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(PlacesService);
    httpTestingController = TestBed.inject(HttpTestingController);
    transferState = TestBed.inject(TransferState);
  }

  describe('on browser platform', () => {
    beforeEach(() => {
      configureTestingModule('browser');
    });

    afterEach(() => httpTestingController.verify());

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should return stored places from TransferState and remove key', (done) => {
      transferState.set(PLACES_KEY, [mockPlace]);

      service.getPlaces().pipe(first()).subscribe((places) => {
        expect(places).toEqual([mockPlace]);
        expect(transferState.hasKey(PLACES_KEY)).toBeFalse();
        done();
      });
    });

    it('should return stored place from TransferState and remove key', (done) => {
      transferState.set(PLACE_KEY, mockPlace);

      service.getPlace('1').pipe(first()).subscribe((place) => {
        expect(place).toEqual(mockPlace);
        expect(transferState.hasKey(PLACE_KEY)).toBeFalse();
        done();
      });
    });

    describe('when triggerReload is called', () => {
      let reloadSubject: jasmine.Spy;

      beforeEach(() => {
        reloadSubject = spyOn(asAny(service).reloadSubject, 'next');
      });

      it('should not emit value when loading is true', () => {
        asAny(service)._loading.set(true);
        service.triggerReload();
        expect(reloadSubject).not.toHaveBeenCalled();
      });

      it('should trigger reloading', () => {
        asAny(service)._loading.set(false);
        service.triggerReload();
        expect(reloadSubject).toHaveBeenCalled();
      });
    });
  });

  describe('on server platform', () => {
    beforeEach(() => {
      configureTestingModule('server');
    });

    afterEach(() => httpTestingController.verify());

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should fetch places and store in TransferState', (done) => {
      service.getPlaces().pipe(first()).subscribe((places) => {
        expect(places).toEqual([mockPlace]);
        expect(transferState.get(PLACES_KEY, null)).toEqual([mockPlace]);
        expect(service.placesQuantity()).toBe(1);
        done();
      });

      const req = httpTestingController.expectOne('/api/places');
      expect(req.request.method).toBe('GET');
      req.flush([mockPlace]);
    });

    it('should fetch single place and store in TransferState', (done) => {
      service.getPlace('1').pipe(first()).subscribe((place) => {
        expect(place).toEqual(mockPlace);
        expect(transferState.get(PLACE_KEY, null)).toEqual(mockPlace);
        done();
      });

      const req = httpTestingController.expectOne('/api/place/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockPlace);
    });
  })
});
