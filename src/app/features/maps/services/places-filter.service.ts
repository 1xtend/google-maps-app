import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PlacesFilters } from '../models/places-filters.interface';

@Injectable({
  providedIn: 'root'
})
export class PlacesFilterService {
  private filtersSubject = new BehaviorSubject<Partial<PlacesFilters>>({});
  filters$ = this.filtersSubject.asObservable();

  updateFilters(filters: Partial<PlacesFilters>): void {
    this.filtersSubject.next(this.normalizeFilters(filters));
  }

  private normalizeFilters<T extends Partial<PlacesFilters>>(filters: T): T {
    const entries = Object.entries(filters)
      .filter(([_, value]) => value)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return [key, value.trim().toLowerCase()]
        }

        return [key, value]
      })
    return Object.fromEntries(entries);
  }
}
