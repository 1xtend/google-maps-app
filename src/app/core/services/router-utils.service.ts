import { inject, Injectable } from '@angular/core';
import { distinctUntilChanged, filter, map, Observable } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouterUtilsService {
  private router = inject(Router);

  hasRoute(url: string): Observable<boolean> {
    return this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.url === url),
      distinctUntilChanged()
    );
  }
}
