import { ChangeDetectionStrategy, Component, model, output } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MapTravelMode } from '../../models/travel-mode.enum';

@Component({
  selector: 'app-map-controls',
  imports: [
    MatButton,
    MatCheckbox,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    FormsModule
  ],
  templateUrl: './map-controls.component.html',
  styleUrl: './map-controls.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapControlsComponent {
  directionMode = model<boolean>(false);
  travelMode = model<MapTravelMode>(MapTravelMode.DRIVING);
  selectedMarkersCount = model<number>(0);

  directionModeChange = output<boolean>();
  travelModeChange = output<MapTravelMode>();
  clearMultiplySelection = output<void>();

  travelModeList: MapTravelMode[] = this.getTravelModeList();

  private getTravelModeList(): MapTravelMode[] {
    return Object.entries(MapTravelMode).map(([_, mode]) => mode)
  }
}
