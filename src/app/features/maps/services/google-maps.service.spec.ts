import { TestBed } from '@angular/core/testing';

import { GoogleMapsService } from './google-maps.service';
import { asAny } from '../../../../testing/test-helpers';

describe('GoogleMapsService', () => {
  let service: GoogleMapsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleMapsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when loadGoogleMaps is called', () => {
    let scriptCreateSpy: jasmine.Spy;

    beforeEach(() => {
      scriptCreateSpy = spyOn(document.head, 'appendChild').and.callThrough();
    });

    it('should resolve promise if loadingPromise is not null', async () => {
      asAny(service).loadingPromise = Promise.resolve();
      await service.loadGoogleMaps();
      expect(scriptCreateSpy).not.toHaveBeenCalled();
    });

    it('should resolve promise if isLoaded is true', async () => {
      asAny(service).isLoaded.set(true);
      await service.loadGoogleMaps();
      expect(scriptCreateSpy).not.toHaveBeenCalled();
    });

    it('should load google-maps and resolve promise', async () => {
      await service.loadGoogleMaps();

      expect(scriptCreateSpy).toHaveBeenCalled();
      expect(service.isLoaded()).toBeTrue();
    })
  })
});
