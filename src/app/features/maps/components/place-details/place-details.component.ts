import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PlacesService } from '../../services/places.service';
import { ActivatedRoute } from '@angular/router';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { Observable } from 'rxjs';
import { Place } from '../../models/place.interface';
import { AsyncPipe } from '@angular/common';
import { LoadingState, withLoadingState } from '../../../../shared/rxjs-operators/with-loading-state.operator';
import { PlaceDetailsListComponent } from '../place-details-list/place-details-list.component';

@Component({
  selector: 'app-place-details',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    AsyncPipe,
    PlaceDetailsListComponent
  ],
  templateUrl: './place-details.component.html',
  styleUrl: './place-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaceDetailsComponent {
  private placesService = inject(PlacesService);
  private route = inject(ActivatedRoute);

  place$: Observable<LoadingState<Place | undefined>> = this.placesService
    .getPlace(this.route.snapshot.params['placeId'])
    .pipe(withLoadingState());
}
