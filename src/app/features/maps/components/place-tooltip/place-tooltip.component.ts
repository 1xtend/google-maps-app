import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Place } from '../../models/place.interface';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';

@Component({
  selector: 'app-place-tooltip',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent
  ],
  templateUrl: './place-tooltip.component.html',
  styleUrl: './place-tooltip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaceTooltipComponent {
  place = input.required<Place>();
}
