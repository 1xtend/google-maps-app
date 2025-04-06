import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { GoogleMapsService } from '../../services/google-maps.service';
import { PlacesService } from '../../services/places.service';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Place } from '../../models/place.interface';

@Component({
  selector: 'app-google-map',
  imports: [GoogleMapsModule, AsyncPipe],
  templateUrl: './google-map.component.html',
  styleUrl: './google-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoogleMapComponent {
  private googleMapsService = inject(GoogleMapsService);
  private placesService = inject(PlacesService)

  isGoogleMapsLoaded = this.googleMapsService.isGoogleMapsLoaded;

  private readonly defaultLocation: google.maps.LatLngLiteral = { lat: 43.651070, lng: -79.347015 } // Toronto

  readonly mapOptions: google.maps.MapOptions = {
    center: this.defaultLocation,
    zoom: 10,
    mapId: 'GOOGLE_MAP'
  }

  readonly places$: Observable<Place[]> = this.placesService.getPlaces();
}
