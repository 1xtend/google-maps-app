import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Place } from '../../models/place.interface';
import { PlaceDetails } from '../../models/place-details.inteface';
import { PlaceDetailsService } from '../../services/place-details.service';

@Component({
  selector: 'app-place-details-list',
  imports: [],
  templateUrl: './place-details-list.component.html',
  styleUrl: './place-details-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaceDetailsListComponent {
  private placeDetailsService = inject(PlaceDetailsService);

  place = input.required<Place>();
  gap = input<'sm' | 'md'>('sm');

  details = computed<PlaceDetails[] | undefined>(() => {
    const place: Place = this.place();
    const detailsArray: PlaceDetails[] = this.placeDetailsService.getDetailsArray(place);
    return detailsArray.length > 0 ? detailsArray : undefined;
  });
}
