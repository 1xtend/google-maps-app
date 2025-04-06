import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { GoogleMapsService } from './features/maps/services/google-maps.service';
import { signal } from '@angular/core';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  const googleMapsServiceSpy = jasmine.createSpyObj('GoogleMapsService', ['loadGoogleMaps']);
  googleMapsServiceSpy.isGoogleMapsLoaded = signal<boolean>(false);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{ provide: GoogleMapsService, useValue: googleMapsServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should call loadGoogleMaps method on initialization', () => {
    googleMapsServiceSpy.loadGoogleMaps.and.returnValue(Promise.resolve());
    fixture.detectChanges();

    expect(googleMapsServiceSpy.loadGoogleMaps).toHaveBeenCalled();
  })
});
