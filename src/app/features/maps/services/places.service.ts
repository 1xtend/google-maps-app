import { inject, Injectable, makeStateKey, PLATFORM_ID, TransferState } from '@angular/core';
import { catchError, Observable, of, shareReplay, tap } from 'rxjs';
import { Place } from '../models/place.interface';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { PlacesFilters } from '../models/places-filters.interface';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private http = inject(HttpClient);
  private transferState = inject(TransferState);
  private platformId = inject(PLATFORM_ID);

  private readonly PLACES_KEY = makeStateKey<Place[]>('places');
  private readonly apiUrl: string = '/api/places';

  getPlaces(filters?: Partial<PlacesFilters>): Observable<Place[]> {
    if (isPlatformBrowser(this.platformId)) {
      const storedPlaces: Place[] | null = this.transferState.get(this.PLACES_KEY, null);

      if (storedPlaces) {
        this.transferState.remove(this.PLACES_KEY);
        return of(storedPlaces);
      }
    }

    return this.fetchPlaces(filters);
  }

  private fetchPlaces(filters?: Partial<PlacesFilters>): Observable<Place[]> {
    return this.http.get<Place[]>(this.apiUrl, { params: filters }).pipe(
      tap((places) => {
        if (isPlatformServer(this.platformId)) {
          this.transferState.set(this.PLACES_KEY, places);
        }
      }),
      shareReplay(1),
      catchError(() => of([]))
    );
  }
}
