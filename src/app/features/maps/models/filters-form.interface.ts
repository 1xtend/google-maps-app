import { FormControl } from '@angular/forms';

export interface FiltersForm {
  search: FormControl<string>;
  county: FormControl<string>;
  streetAddress: FormControl<string>;
  tags: FormControl<string[]>;
}
