import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { PlacesFilterService } from '../../../features/maps/services/places-filter.service';
import { MatButton } from '@angular/material/button';
import { FiltersForm } from '../../../features/maps/models/filters-form.interface';
import { PlacesService } from '../../../features/maps/services/places.service';

@Component({
  selector: 'app-sidenav',
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule,
    MatButton,
    MatHint
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidenavComponent {
  private fb = inject(FormBuilder).nonNullable;
  private placesFilterService = inject(PlacesFilterService);
  private placesService = inject(PlacesService);

  readonly filtersForm = this.fb.group<FiltersForm>({
    search: this.fb.control<string>('')
  });
  placesQuantity = this.placesService.placesQuantity;

  constructor() {
    this.filtersForm.valueChanges.pipe(
      takeUntilDestroyed(),
      debounceTime(300),
      distinctUntilChanged(this.deepEqual.bind(this))
    ).subscribe((value) => {
      this.placesFilterService.updateFilters(value);
    })
  }

  onResetFilters(): void {
    this.filtersForm.reset();
  }

  private deepEqual(obj1: any, obj2: any): boolean {
    if (obj1 === obj2) return true;

    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
      return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
      if (!keys2.includes(key)) return false;

      if (!this.deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }

    return true;
  }
}
