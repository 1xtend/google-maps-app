import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceDetailsComponent } from './place-details.component';
import { PlacesService } from '../../services/places.service';
import { ActivatedRoute } from '@angular/router';
import { Place } from '../../models/place.interface';
import { of } from 'rxjs';

describe('PlaceDetailsComponent', () => {
  let component: PlaceDetailsComponent;
  let fixture: ComponentFixture<PlaceDetailsComponent>;

  let placesServiceMock: jasmine.SpyObj<PlacesService>;
  let activatedRouteMock: { snapshot: { params: { placeId: string } } };

  const place = {
    name: 'Hungry Boba Pizzeria',
    description: 'desc',
    url: 'https://www.hungrybobapizzeria.ie/',
    telephone: '+35316336814',
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 53.351338,
      longitude: -6.2795464
    },
    id: '1'
  } as Place;

  beforeEach(async () => {
    placesServiceMock = jasmine.createSpyObj('PlacesService', ['getPlace']);
    activatedRouteMock = { snapshot: { params: { placeId: '1' } } };

    placesServiceMock.getPlace.and.returnValue(of(place));

    await TestBed.configureTestingModule({
      imports: [PlaceDetailsComponent],
      providers: [
        { provide: PlacesService, useValue: placesServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PlaceDetailsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
