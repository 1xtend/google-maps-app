import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { RouterUtilsService } from '../../../core/services/router-utils.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  let routerUtilsServiceMock: jasmine.SpyObj<RouterUtilsService>;

  beforeEach(async () => {
    routerUtilsServiceMock = jasmine.createSpyObj('RouterUtilsService', ['hasRoute']);
    routerUtilsServiceMock.hasRoute.and.returnValue(of(true));

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        { provide: RouterUtilsService, useValue: routerUtilsServiceMock },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set showMenuButton to true when routerUtilsServiceMock.hasRoute returns true', () => {
    routerUtilsServiceMock.hasRoute.and.returnValue(of(true));
    expect(component.showMenuButton()).toBeTrue();
  });

  it('should set showMenuButton to false when routerUtilsServiceMock.hasRoute returns false', () => {
    routerUtilsServiceMock.hasRoute.and.returnValue(of(false));
    expect(component.showMenuButton()).toBeTrue();
  });
});
