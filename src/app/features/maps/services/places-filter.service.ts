import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PlacesFilters } from '../models/places-filters.interface';
import { FiltersFormValue } from '../models/filters-form-value.type';

@Injectable({
  providedIn: 'root'
})
export class PlacesFilterService {
  private filtersSubject = new BehaviorSubject<Partial<PlacesFilters>>({});
  filters$ = this.filtersSubject.asObservable();

  updateFilters(filters: Partial<FiltersFormValue>): void {
    this.filtersSubject.next(this.normalizeFilters(filters));
  }

  private normalizeFilters(filters: Partial<FiltersFormValue>): Partial<PlacesFilters> {
    const entries = Object.entries(filters)
      .filter(([_, value]) => this.filterEntries(value))
      .map((filter) => this.mapEntries(filter))
    return Object.fromEntries(entries);
  }

  private filterEntries(value: unknown): boolean {
    if (value && Array.isArray(value)) {
      return value.length > 0;
    }

    return !!value;
  }

  private mapEntries([key, value]: [string, any]): [string, any] {
    if (typeof value === 'string') {
      return [key, value.trim().toLowerCase()];
    }

    if (Array.isArray(value)) {
      return [key, value.join(',').toLowerCase()];
    }

    return [key, value];
  }
}
