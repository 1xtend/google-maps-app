import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleMapComponent } from './google-map.component';
import { GoogleMapsService } from '../../services/google-maps.service';
import { PLATFORM_ID, signal } from '@angular/core';
import { PlacesService } from '../../services/places.service';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { PlacesFilterService } from '../../services/places-filter.service';
import { PlacesFilters } from '../../models/places-filters.interface';
import { PlaceTooltipService } from '../../services/place-tooltip.service';
import { SelectedMarkersService } from '../../services/selected-markers.service';
import { Marker } from '../../models/marker.interface';
import { DirectionService } from '../../services/direction.service';
import { Place } from '../../models/place.interface';
import { GoogleMap } from '@angular/google-maps';
import { asAny } from '../../../../../testing/test-helpers';
import { ActivatedRoute } from '@angular/router';

describe('GoogleMapComponent', () => {
  let component: GoogleMapComponent;
  let fixture: ComponentFixture<GoogleMapComponent>;

  let googleMapsServiceMock: jasmine.SpyObj<GoogleMapsService>;
  let placesServiceMock: jasmine.SpyObj<PlacesService>;
  let placesFilterServiceMock: { filters$: BehaviorSubject<Partial<PlacesFilters>> };
  let placeTooltipServiceMock: jasmine.SpyObj<PlaceTooltipService>;
  let selectedMarkersServiceMock: jasmine.SpyObj<SelectedMarkersService>;
  let directionServiceMock: jasmine.SpyObj<DirectionService>;
  let clearMultiplySelectionSpy: jasmine.Spy;
  let googleMapSpy: jasmine.Spy;

  const defaultLocation: google.maps.LatLngLiteral = { lat: 53.4494762, lng: -7.5029786 };
  const place = { geo: { latitude: 1, longitude: 2 } } as Place;
  const googleMap = {} as GoogleMap;

  beforeEach(async () => {
    googleMapsServiceMock = {
      ...jasmine.createSpyObj('GoogleMapsService', ['loadGoogleMaps']),
      isLoaded: signal<boolean>(false)
    };
    placesServiceMock = { ...jasmine.createSpyObj('PlacesService', ['getPlaces']), reload$: new Subject<void>() };
    placesFilterServiceMock = { filters$: new BehaviorSubject<Partial<PlacesFilters>>({}) };
    placeTooltipServiceMock = jasmine.createSpyObj('PlaceTooltipService', ['show', 'cleanSubscriptions']);
    selectedMarkersServiceMock = {
      ...jasmine.createSpyObj('SelectedMarkersService', ['hasMarker', 'selectMultiplyMarkers', 'unselectAllMultiplyMarkers']),
      selectedMarkers: signal<Marker[]>([])
    };
    directionServiceMock = jasmine.createSpyObj('DirectionService', ['calculateDirection', 'clearDirection']);

    placesServiceMock.getPlaces.and.returnValue(of([place]));

    await TestBed.configureTestingModule({
      imports: [GoogleMapComponent],
      providers: [
        { provide: GoogleMapsService, useValue: googleMapsServiceMock },
        { provide: PlacesService, useValue: placesServiceMock },
        { provide: PlacesFilterService, useValue: placesFilterServiceMock },
        { provide: PlaceTooltipService, useValue: placeTooltipServiceMock },
        { provide: SelectedMarkersService, useValue: selectedMarkersServiceMock },
        { provide: DirectionService, useValue: directionServiceMock },
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GoogleMapComponent);
    component = fixture.componentInstance;

    googleMapSpy = spyOn(asAny(component), 'googleMap').and.returnValue(googleMap);
    clearMultiplySelectionSpy = spyOn(asAny(component), 'clearMultiplySelection');

    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct mapOptions', () => {
    expect(component.mapOptions).toEqual({
      center: defaultLocation,
      zoom: 7,
      mapId: 'GOOGLE_MAP',
      gestureHandling: 'greedy'
    });
  });

  it('should have correct markerOptions', () => {
    expect(component.markerOptions).toEqual({
      gmpClickable: true
    });
  });

  it('should call googleMapsService.loadGoogleMaps on initialize', () => {
    expect(googleMapsServiceMock.loadGoogleMaps).toHaveBeenCalledTimes(1);
  });

  describe('when onDirectionModeChange is called', () => {
    it('should do nothing when directionMode is true', () => {
      component.directionMode.set(true);
      component.onDirectionModeChange();
      expect(clearMultiplySelectionSpy).not.toHaveBeenCalled();
    });

    it('should call clearMultiplySelection when directionMode is false', () => {
      component.directionMode.set(false);
      component.onDirectionModeChange();
      expect(clearMultiplySelectionSpy).toHaveBeenCalled();
    });
  });

  it('should call clearMultiplySelection when onClearMultiplySelection is called', () => {
    component.onClearMultiplySelection();
    expect(clearMultiplySelectionSpy).toHaveBeenCalled();
  });

  describe('when onMarkerClick is called', () => {
    let handleMarkerClickSpy: jasmine.Spy;
    let markerElements: HTMLElement[] = [];

    function createMarkerEl(): HTMLElement {
      const el = document.createElement('div');
      markerElements.push(el);
      return el;
    }

    beforeEach(() => {
      handleMarkerClickSpy = spyOn(asAny(component), 'handleMarkerClick');
    });

    afterEach(() => {
      markerElements.forEach((el) => el.remove());
      markerElements = [];
    });

    it('should not call handleMarkerClick when el is undefined', () => {
      const event = { domEvent: { target: null } } as unknown as google.maps.MapMouseEvent;
      component.onMarkerClick(event, place);
      expect(handleMarkerClickSpy).not.toHaveBeenCalled();
    });

    it('should not call handleMarkerClick when googleMap is undefined', () => {
      const event = { domEvent: { target: createMarkerEl() } } as unknown as google.maps.MapMouseEvent;
      googleMapSpy.and.returnValue(undefined);
      component.onMarkerClick(event, place);
      expect(handleMarkerClickSpy).not.toHaveBeenCalled();
    });

    it('should call handleMarkerClick', () => {
      const event = { domEvent: { target: createMarkerEl() } } as unknown as google.maps.MapMouseEvent;
      googleMapSpy.and.returnValue({});
      component.onMarkerClick(event, place);
      expect(handleMarkerClickSpy).toHaveBeenCalled();
    })
  });
});
