import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavComponent } from './sidenav.component';
import { PlacesFilterService } from '../../../features/maps/services/places-filter.service';
import { PlacesService } from '../../../features/maps/services/places.service';
import { signal } from '@angular/core';
import { EqualityService } from '../../../core/services/equality.service';
import { asAny } from '../../../../testing/test-helpers';
import { counties } from '../../helpers/counties';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  let placesFilterServiceMock: jasmine.SpyObj<PlacesFilterService>;
  let placesServiceMock: jasmine.SpyObj<PlacesService>;
  let equalityServiceMock: jasmine.SpyObj<EqualityService>;

  beforeEach(async () => {
    placesFilterServiceMock = jasmine.createSpyObj('PlacesFilterService', ['updateFilters']);
    placesServiceMock = {
      ...jasmine.createSpyObj('PlacesService', ['triggerReload']),
      placesQuantity: signal<number>(0),
      loading: signal<boolean>(false),
    };
    equalityServiceMock = jasmine.createSpyObj('EqualityService', ['deepEqual']);

    await TestBed.configureTestingModule({
      imports: [SidenavComponent],
      providers: [
        { provide: PlacesFilterService, useValue: placesFilterServiceMock },
        { provide: PlacesService, useValue: placesServiceMock },
        { provide: EqualityService, useValue: equalityServiceMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize filtersForm correctly', () => {
    expect(component.filtersForm.getRawValue()).toEqual({
      search: '',
      county: '',
      streetAddress: '',
      tags: []
    });
  });

  it('should reset form when onResetFilters is called', () => {
    const resetSpy = spyOn(component.filtersForm, 'reset');
    const deselectSpy = spyOn(asAny(component), 'countyAutocomplete').and.returnValue({
      options: {
        last: {
          deselect: () => {
          }
        }
      }
    });

    component.onResetFilters();

    expect(resetSpy).toHaveBeenCalled();
    expect(deselectSpy).toHaveBeenCalled();
  });

  it('should trigger reload when onReload is called', () => {
    component.onReload();
    expect(placesServiceMock.triggerReload).toHaveBeenCalled();
  });

  describe('when onFilterCounties is called', () => {
    it('should set whole countiesList to filteredCounties', () => {
      const event = { target: { value: '' } } as unknown as Event;
      component.onFilterCounties(event);
      expect(component.filteredCounties()).toEqual(counties);
    });

    it('should filter counties list when value is provided', () => {
      const event = { target: { value: 'cork' } } as unknown as Event;
      component.onFilterCounties(event);
      expect(component.filteredCounties().length).toBe(1);
    });
  });
});
