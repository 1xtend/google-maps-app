import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceDetailsListComponent } from './place-details-list.component';
import { PlaceDetailsService } from '../../services/place-details.service';
import { Place } from '../../models/place.interface';
import { ComponentRef } from '@angular/core';
import { PlaceDetails } from '../../models/place-details.inteface';

describe('PlaceDetailsListComponent', () => {
  let component: PlaceDetailsListComponent;
  let fixture: ComponentFixture<PlaceDetailsListComponent>;
  let componentRef: ComponentRef<PlaceDetailsListComponent>;

  let placeDetailsService: jasmine.SpyObj<PlaceDetailsService>;

  const place = {
    url: 'https://www.hungrybobapizzeria.ie/',
    telephone: '+35316336814',
  } as Place;

  beforeEach(async () => {
    placeDetailsService = jasmine.createSpyObj('PlaceDetailsService', ['getDetailsArray']);

    await TestBed.configureTestingModule({
      imports: [PlaceDetailsListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PlaceDetailsListComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput('place', place);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create details array', () => {
    const array: PlaceDetails[] = [
      { label: 'Phone number', value: place.telephone, type: 'text' },
      { label: 'Visit website', value: place.url, type: 'link' }
    ];
    placeDetailsService.getDetailsArray.and.returnValue(array);
    expect(component.details()).toEqual(array);
  })
});
