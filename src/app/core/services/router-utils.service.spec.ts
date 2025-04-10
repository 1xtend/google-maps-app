import { TestBed } from '@angular/core/testing';

import { RouterUtilsService } from './router-utils.service';
import { Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

describe('RouterUtilsService', () => {
  let service: RouterUtilsService;

  let events: Subject<NavigationEnd>;
  let mockRouter: Partial<Router>;

  beforeEach(() => {
    events = new Subject();
    mockRouter = { events: events.asObservable() };

    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: mockRouter }]
    });
    service = TestBed.inject(RouterUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true if NavigationEnd.url matches the given URL', (done) => {
    const url = '/api';

    const subscription = service.hasRoute(url).subscribe((result) => {
      expect(result).toBeTrue();
      subscription.unsubscribe();
      done();
    });

    events.next(new NavigationEnd(1, url, url));
  });

  it('should return false if NavigationEnd.url does not match the given URL', (done) => {
    const url = '/api';

    const subscription = service.hasRoute(url).subscribe((result) => {
      expect(result).toBeFalse();
      subscription.unsubscribe();
      done();
    });

    events.next(new NavigationEnd(1, '/api/places', '/api/places'));
  })
});
