import { inject, Injectable, makeStateKey, PLATFORM_ID, signal, TransferState } from '@angular/core';
import { catchError, finalize, Observable, of, shareReplay, tap } from 'rxjs';
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

  private _placesQuantity = signal<number>(0);
  placesQuantity = this._placesQuantity.asReadonly();

  private _loading = signal<boolean>(false);
  loading = this._loading.asReadonly();


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
    this._loading.set(true);

    return this.http.get<Place[]>(this.apiUrl, { params: filters }).pipe(
      tap((places) => {
        if (isPlatformServer(this.platformId)) {
          this.transferState.set(this.PLACES_KEY, places);
        }

        this._placesQuantity.set(places.length);
      }),
      finalize(() => this._loading.set(false)),
      shareReplay(1),
      catchError(() => of([]))
    );
  }
}
