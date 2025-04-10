import { TestBed } from '@angular/core/testing';

import { PlaceTooltipService } from './place-tooltip.service';
import { ComponentRef, Renderer2, ViewContainerRef } from '@angular/core';
import { SelectedMarkersService } from './selected-markers.service';
import { GoogleMap } from '@angular/google-maps';
import { PlaceTooltipComponent } from '../components/place-tooltip/place-tooltip.component';
import { of } from 'rxjs';
import { asAny } from '../../../../testing/test-helpers';

describe('PlaceTooltipService', () => {
  let service: PlaceTooltipService;

  let viewContainerRefMock: jasmine.SpyObj<ViewContainerRef>;
  let rendererMock: jasmine.SpyObj<Renderer2>;
  let selectedMarkersServiceMock: jasmine.SpyObj<SelectedMarkersService>;

  let tooltipComponentRefMock: jasmine.SpyObj<ComponentRef<PlaceTooltipComponent>>;
  let googleMapMock: jasmine.SpyObj<GoogleMap>;
  let markerElMock: jasmine.SpyObj<HTMLElement>;
  let tooltipElMock: jasmine.SpyObj<HTMLElement>;
  let mapDivMock: jasmine.SpyObj<HTMLElement>;

  let locationMock: any;
  let place: any;

  beforeEach(() => {
    viewContainerRefMock = jasmine.createSpyObj('ViewContainerRef', ['createComponent']);
    rendererMock = jasmine.createSpyObj('Renderer2', ['setStyle']);
    selectedMarkersServiceMock = jasmine.createSpyObj('SelectedMarkersService', ['selectMarker', 'unselectMarker']);

    tooltipElMock = jasmine.createSpyObj('HTMLElement', ['getBoundingClientRect', 'contains']);
    markerElMock = jasmine.createSpyObj('HTMLElement', ['getBoundingClientRect', 'contains']);
    mapDivMock = jasmine.createSpyObj('HTMLElement', ['getBoundingClientRect']);

    locationMock = { nativeElement: tooltipElMock };
    tooltipComponentRefMock = jasmine.createSpyObj('ComponentRef', ['destroy', 'setInput'], { location: locationMock });

    googleMapMock = jasmine.createSpyObj('GoogleMap', [], {
      googleMap: { getDiv: jasmine.createSpy('getDiv').and.returnValue(mapDivMock) },
      zoomChanged: of({})
    });

    viewContainerRefMock.createComponent.and.returnValue(tooltipComponentRefMock);

    TestBed.configureTestingModule({
      providers: [
        { provide: ViewContainerRef, useValue: viewContainerRefMock },
        { provide: Renderer2, useValue: rendererMock },
        { provide: SelectedMarkersService, useValue: selectedMarkersServiceMock }
      ]
    });
    service = TestBed.inject(PlaceTooltipService);

    markerElMock.getBoundingClientRect.and.returnValue({
      top: 100, right: 150, bottom: 150, left: 100, width: 50, height: 50
    } as DOMRect);

    tooltipElMock.getBoundingClientRect.and.returnValue({
      top: 0, right: 200, bottom: 80, left: 0, width: 200, height: 80
    } as DOMRect);

    mapDivMock.getBoundingClientRect.and.returnValue({
      top: 0, right: 1000, bottom: 800, left: 0, width: 1000, height: 800
    } as DOMRect);

    spyOn(service, 'cleanSubscriptions').and.callThrough();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when show is called', () => {
    it('should create tooltip component', (done) => {
      service.show(markerElMock, place, googleMapMock);

      expect(viewContainerRefMock.createComponent).toHaveBeenCalled();
      expect(tooltipComponentRefMock.setInput).toHaveBeenCalledWith('place', place);
      expect(selectedMarkersServiceMock.selectMarker).toHaveBeenCalledWith(markerElMock, place);

      expect(rendererMock.setStyle).toHaveBeenCalledWith(tooltipElMock, 'top', 0);
      expect(rendererMock.setStyle).toHaveBeenCalledWith(tooltipElMock, 'left', 0);
      expect(rendererMock.setStyle).toHaveBeenCalledWith(tooltipElMock, 'visibility', 'hidden');

      setTimeout(() => {
        expect(rendererMock.setStyle).toHaveBeenCalledWith(tooltipElMock, 'top', jasmine.any(Number));
        expect(rendererMock.setStyle).toHaveBeenCalledWith(tooltipElMock, 'left', jasmine.any(Number));
        expect(rendererMock.setStyle).toHaveBeenCalledWith(tooltipElMock, 'visibility', 'visible');
        done();
      }, 0);
    });

    it('should call hide if tooltip already exists', () => {
      spyOn(service, 'hide');

      service.show(markerElMock, place, googleMapMock);
      service.show(markerElMock, place, googleMapMock);

      expect(service.hide).toHaveBeenCalled();
    });
  });

  describe('when hide is called', () => {
    beforeEach(() => {
      service.show(markerElMock, place, googleMapMock);
    });

    it('should destroy tooltip component', () => {
      service.hide();

      expect(tooltipComponentRefMock.destroy).toHaveBeenCalled();
      expect(selectedMarkersServiceMock.unselectMarker).toHaveBeenCalled();
      expect(service.cleanSubscriptions).toHaveBeenCalled();
    });

    it('should do nothing if tooltip not exists', () => {
      service.hide();
      tooltipComponentRefMock.destroy.calls.reset();
      selectedMarkersServiceMock.unselectMarker.calls.reset();
      (service.cleanSubscriptions as jasmine.Spy).calls.reset();

      service.hide();

      expect(tooltipComponentRefMock.destroy).not.toHaveBeenCalled();
      expect(selectedMarkersServiceMock.unselectMarker).not.toHaveBeenCalled();
      expect(service.cleanSubscriptions).not.toHaveBeenCalled();
    });
  });

  it('should unsubscribe all subscriptions', () => {
    const subscription1 = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    const subscription2 = jasmine.createSpyObj('Subscription', ['unsubscribe']);

    asAny(service).subscriptions = [subscription1, subscription2];

    service.cleanSubscriptions();

    expect(subscription1.unsubscribe).toHaveBeenCalled();
    expect(subscription2.unsubscribe).toHaveBeenCalled();
    expect(asAny(service).subscriptions.length).toBe(0);
  });
});
