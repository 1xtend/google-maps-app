import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef, effect,
  inject, PLATFORM_ID,
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
import { tags } from '../../helpers/tags';
import { MatSelect } from '@angular/material/select';
import { EqualityService } from '../../../core/services/equality.service';
import { isPlatformBrowser } from '@angular/common';

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
    MatOption,
    MatSelect
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
  private equalityService = inject(EqualityService);
  private platformId = inject(PLATFORM_ID);

  private countyAutocomplete = viewChild<MatAutocomplete>('countyAutocomplete');

  readonly filtersForm = this.fb.group<FiltersForm>({
    search: this.fb.control<string>(''),
    county: this.fb.control<string>(''),
    streetAddress: this.fb.control<string>(''),
    tags: this.fb.control<string[]>([])
  });

  private readonly countiesList: string[] = counties;
  readonly tagsList: string[] = tags;

  placesQuantity = this.placesService.placesQuantity;
  filteredCounties = signal<string[]>(this.countiesList);
  placesLoading = this.placesService.loading;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      effect(() => {
        const placesLoading: boolean | undefined = this.placesLoading();

        if (placesLoading) {
          this.filtersForm.disable();
        } else {
          this.filtersForm.enable();
        }
      });
    }

    afterNextRender(() => {
      this.filterChanges();
    })
  }

  onResetFilters(): void {
    this.filtersForm.reset();
    this.countyAutocomplete()?.options.last.deselect();
  }

  onFilterCounties(e: Event): void {
    const value = (e.target as HTMLInputElement).value;

    if (!value) {
      this.filteredCounties.set(this.countiesList);
      return;
    }

    const filterValue: string = value.trim().toLowerCase();
    this.filteredCounties.set(this.countiesList.filter((county) => county.toLowerCase().includes(filterValue)))
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
    return this.equalityService.deepEqual(a, b);
  }
}
