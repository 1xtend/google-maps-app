import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceTooltipComponent } from './place-tooltip.component';
import { ComponentRef } from '@angular/core';
import { Place } from '../../models/place.interface';
import { ActivatedRoute } from '@angular/router';

describe('PlaceTooltipComponent', () => {
  let component: PlaceTooltipComponent;
  let fixture: ComponentFixture<PlaceTooltipComponent>;
  let componentRef: ComponentRef<PlaceTooltipComponent>;

  const place = { name: 'Amazing place', id: '1' } as Place;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaceTooltipComponent],
      providers: [{ provide: ActivatedRoute, useValue: {} }]
    }).compileComponents();

    fixture = TestBed.createComponent(PlaceTooltipComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput('place', place);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
