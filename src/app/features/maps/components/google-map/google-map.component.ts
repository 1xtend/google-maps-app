import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { GoogleMapsService } from '../../services/google-maps.service';

@Component({
  selector: 'app-google-map',
  imports: [GoogleMapsModule],
  templateUrl: './google-map.component.html',
  styleUrl: './google-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoogleMapComponent {
  private googleMapsService = inject(GoogleMapsService);

  isGoogleMapsLoaded = this.googleMapsService.isGoogleMapsLoaded;
}
