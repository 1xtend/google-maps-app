import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  viewChild
} from '@angular/core';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { PlacesFilterService } from '../../../features/maps/services/places-filter.service';
import { MatButton } from '@angular/material/button';
import { FiltersForm } from '../../../features/maps/models/filters-form.interface';
import { PlacesService } from '../../../features/maps/services/places.service';
import { counties } from '../../helpers/counties';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';

@Component({
  selector: 'app-sidenav',
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule,
    MatButton,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidenavComponent {
  private fb = inject(FormBuilder).nonNullable;
  private placesFilterService = inject(PlacesFilterService);
  private placesService = inject(PlacesService);
  private destroyRef = inject(DestroyRef);

  private autocomplete = viewChild<MatAutocomplete>('autocomplete');

  readonly filtersForm = this.fb.group<FiltersForm>({
    search: this.fb.control<string>(''),
    county: this.fb.control<string>('')
  });

  private readonly counties: string[] = counties;

  placesQuantity = this.placesService.placesQuantity;
  filteredCounties = signal<string[]>(this.counties);

  constructor() {
    afterNextRender(() => {
      this.filterChanges();
    })
  }

  onResetFilters(): void {
    this.filtersForm.reset();
    this.autocomplete()?.options.last.deselect();
  }

  onFilterCounties(e: Event): void {
    const value = (e.target as HTMLInputElement).value;

    if (!value) {
      this.filteredCounties.set(this.counties);
      return;
    }

    const filterValue: string = value.trim().toLowerCase();
    this.filteredCounties.set(this.counties.filter((county) => county.toLowerCase().includes(filterValue)))
  }

  private filterChanges(): void {
    this.filtersForm.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      debounceTime(300),
      distinctUntilChanged((prev, curr) => this.deepEqual(prev, curr)),
    ).subscribe((value) => {
      this.placesFilterService.updateFilters(value);
    })
  }

  private deepEqual(a: any, b: any): boolean {
    if (a === b) {
      return true;
    }

    if (typeof a === 'string' && typeof b === 'string') {
      return a.trim() === b.trim();
    }

    // null, undefined and '' are equal
    if ((a === null || a === undefined || a === '') && (b === null || b === undefined || b === '')) {
      return true;
    }

    // If one of arguments is null or undefined, they're not equal
    if (a === null || b === null || a === undefined || b === undefined) {
      return false;
    }

    if (typeof a === 'object' && typeof b === 'object') {
      for (const key of Object.keys(a)) {
        const valueA = a[key];
        const valueB = b[key];

        if (!this.deepEqual(valueA, valueB)) {
          return false;
        }
      }

      return true;
    }

    return true;
  }
}
