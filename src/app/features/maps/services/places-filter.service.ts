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
    this.filtersSubject.next(filters);
  }
}
