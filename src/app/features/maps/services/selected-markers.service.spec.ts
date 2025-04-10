import { TestBed } from '@angular/core/testing';

import { SelectedMarkersService } from './selected-markers.service';
import { Renderer2 } from '@angular/core';
import { Place } from '../models/place.interface';

describe('SelectedMarkersService', () => {
  let service: SelectedMarkersService;

  let mockRenderer: jasmine.SpyObj<Renderer2>;
  const place = { name: 'Amazing place' } as Place;
  let markerElements: HTMLElement[] = [];

  function createMarkerEl(): HTMLElement {
    const el = document.createElement('div');
    markerElements.push(el);
    return el;
  }

  beforeEach(() => {
    mockRenderer = jasmine.createSpyObj('Renderer2', ['addClass', 'removeClass']);

    TestBed.configureTestingModule({
      providers: [{ provide: Renderer2, useValue: mockRenderer }]
    });
    service = TestBed.inject(SelectedMarkersService);
  });

  afterEach(() => {
    markerElements.forEach((el) => el.remove());
    markerElements = [];
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should select single marker', () => {
    const markerEl = createMarkerEl();
    service.selectMarker(markerEl, place);

    const selected = service.selectedMarker();

    expect(selected?.el).toBe(markerEl);
    expect(selected?.place).toBe(place);
    expect(mockRenderer.addClass).toHaveBeenCalledWith(markerEl, 'active-marker');
  });

  it('should unselect a marker and remove class', () => {
    const markerEl = createMarkerEl();
    service.selectMarker(markerEl, place);

    service.unselectMarker();

    expect(service.selectedMarker()).toBeNull();
    expect(mockRenderer.removeClass).toHaveBeenCalledWith(markerEl, 'active-marker');
  });

  it('should select multiple markers if less than two', () => {
    const markerEl1 = createMarkerEl();
    const markerEl2 = createMarkerEl();

    service.selectMultiplyMarkers(markerEl1, place);
    service.selectMultiplyMarkers(markerEl2, place);

    const selected = service.selectedMarkers();
    expect(selected.length).toBe(2);
    expect(selected[0].el).toBe(markerEl1);
    expect(selected[1].el).toBe(markerEl2);
    expect(mockRenderer.addClass).toHaveBeenCalledWith(markerEl1, 'active-marker');
    expect(mockRenderer.addClass).toHaveBeenCalledWith(markerEl2, 'active-marker');
  });

  it('should reset markers if more than 1 selected and add new marker', () => {
    const markerEl1 = createMarkerEl();
    const markerEl2 = createMarkerEl();
    const markerEl3 = createMarkerEl();

    service.selectMultiplyMarkers(markerEl1, place);
    service.selectMultiplyMarkers(markerEl2, place);
    service.selectMultiplyMarkers(markerEl3, place);

    const selected = service.selectedMarkers();
    expect(selected.length).toBe(1);
    expect(selected[0].el).toBe(markerEl3);
    expect(mockRenderer.removeClass).toHaveBeenCalledWith(markerEl1, 'active-marker');
    expect(mockRenderer.removeClass).toHaveBeenCalledWith(markerEl2, 'active-marker');
  });

  it('should unselect all multiply markers and remove class', () => {
    const markerEl1 = createMarkerEl();
    const markerEl2 = createMarkerEl();

    service.selectMultiplyMarkers(markerEl1, place);
    service.selectMultiplyMarkers(markerEl2, place);

    service.unselectAllMultiplyMarkers();

    expect(service.selectedMarkers()).toEqual([]);
    expect(mockRenderer.removeClass).toHaveBeenCalledWith(markerEl1, 'active-marker');
    expect(mockRenderer.removeClass).toHaveBeenCalledWith(markerEl2, 'active-marker');
  });

  it('should check if a marker is selected', () => {
    const markerEL = createMarkerEl();

    expect(service.hasMarker(markerEL)).toBeFalse();

    service.selectMultiplyMarkers(markerEL, place);

    expect(service.hasMarker(markerEL)).toBeTrue();
  });

  it('should not add class if already present', () => {
    const markerEL = createMarkerEl();
    markerEL.classList.add('active-marker');

    service.selectMarker(markerEL, place);

    expect(mockRenderer.addClass).not.toHaveBeenCalled();
  });
});
