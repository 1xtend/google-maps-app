import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterUtilsService } from './core/services/router-utils.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  let routerUtilsServiceMock: jasmine.SpyObj<RouterUtilsService>;

  beforeEach(async () => {
    routerUtilsServiceMock = jasmine.createSpyObj('RouterUtilsService', ['hasRoute']);
    routerUtilsServiceMock.hasRoute.and.returnValue(of(true));

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: RouterUtilsService, useValue: routerUtilsServiceMock },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should set sidenavFullHeight to true when routerUtilsServiceMock.hasRoute returns true', () => {
    routerUtilsServiceMock.hasRoute.and.returnValue(of(true));
    expect(component.sidenavFullHeight()).toBeTrue();
  });

  it('should set sidenavFullHeight to false when routerUtilsServiceMock.hasRoute returns false', () => {
    routerUtilsServiceMock.hasRoute.and.returnValue(of(false));
    expect(component.sidenavFullHeight()).toBeTrue();
  });
});
