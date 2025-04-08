import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Place } from '../../models/place.interface';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { PlaceDetailsListComponent } from '../place-details-list/place-details-list.component';

@Component({
  selector: 'app-place-tooltip',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    RouterLink,
    PlaceDetailsListComponent
  ],
  templateUrl: './place-tooltip.component.html',
  styleUrl: './place-tooltip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaceTooltipComponent {
  place = input.required<Place>();
}
