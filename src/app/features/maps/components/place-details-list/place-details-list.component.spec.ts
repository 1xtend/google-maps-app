import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceDetailsListComponent } from './place-details-list.component';

describe('PlaceDetailsListComponent', () => {
  let component: PlaceDetailsListComponent;
  let fixture: ComponentFixture<PlaceDetailsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaceDetailsListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PlaceDetailsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
