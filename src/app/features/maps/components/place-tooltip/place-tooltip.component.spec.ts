import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceTooltipComponent } from './place-tooltip.component';

describe('PlaceTooltipComponent', () => {
  let component: PlaceTooltipComponent;
  let fixture: ComponentFixture<PlaceTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaceTooltipComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PlaceTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
