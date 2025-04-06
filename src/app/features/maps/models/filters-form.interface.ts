import { FormControl } from '@angular/forms';
import { PlacesFilters } from './places-filters.interface';

export type FiltersForm = {
  [K in keyof PlacesFilters]: FormControl<PlacesFilters[K]>;
}
