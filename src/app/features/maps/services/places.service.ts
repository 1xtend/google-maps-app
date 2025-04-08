import { inject, Injectable, makeStateKey, PLATFORM_ID, signal, TransferState } from '@angular/core';
import { catchError, finalize, Observable, of, Subject, tap } from 'rxjs';
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
  private readonly PLACE_KEY = makeStateKey<Place>('place');
  private readonly apiUrl: string = '/api';

  private _placesQuantity = signal<number>(0);
  placesQuantity = this._placesQuantity.asReadonly();

  private _loading = signal<boolean>(false);
  loading = this._loading.asReadonly();

  private reloadSubject = new Subject<void>();
  reload$ = this.reloadSubject.asObservable();

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

  getPlace(placeId: string): Observable<Place | undefined> {
    if (isPlatformBrowser(this.platformId)) {
      const storedPlace: Place | null = this.transferState.get(this.PLACE_KEY, null);

      if (storedPlace) {
        this.transferState.remove(this.PLACE_KEY);
        return of(storedPlace);
      }
    }

    return this.fetchPlace(placeId);
  }

  triggerReload(): void {
    if (this._loading()) {
      return;
    }

    this.reloadSubject.next();
  }

  private fetchPlaces(filters?: Partial<PlacesFilters>): Observable<Place[]> {
    this._loading.set(true);

    return this.http.get<Place[]>(`${ this.apiUrl }/places`, { params: filters }).pipe(
      tap((places) => {
        if (isPlatformServer(this.platformId)) {
          this.transferState.set(this.PLACES_KEY, places);
        }

        this._placesQuantity.set(places.length);
      }),
      finalize(() => this._loading.set(false)),
      catchError(() => of([]))
    );
  }

  private fetchPlace(placeId: string): Observable<Place | undefined> {
    return this.http.get<Place>(`${ this.apiUrl }/place/${ placeId }`).pipe(
      tap((place) => {
        if (isPlatformServer(this.platformId)) {
          this.transferState.set(this.PLACE_KEY, place);
        }
      }),
      catchError(() => of(undefined))
    )
  }
}
