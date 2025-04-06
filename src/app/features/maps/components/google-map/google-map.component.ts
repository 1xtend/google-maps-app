import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { GoogleMapsService } from '../../services/google-maps.service';
import { PlacesService } from '../../services/places.service';
import { AsyncPipe } from '@angular/common';
import { Observable, switchMap } from 'rxjs';
import { Place } from '../../models/place.interface';
import { PlacesFilterService } from '../../services/places-filter.service';

@Component({
  selector: 'app-google-map',
  imports: [GoogleMapsModule, AsyncPipe],
  templateUrl: './google-map.component.html',
  styleUrl: './google-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoogleMapComponent {
  private googleMapsService = inject(GoogleMapsService);
  private placesService = inject(PlacesService);
  private placesFilterService = inject(PlacesFilterService);

  isGoogleMapsLoaded = this.googleMapsService.isGoogleMapsLoaded;

  private readonly defaultLocation: google.maps.LatLngLiteral = { lat: 53.4494762, lng: -7.5029786 }; // Geographical centre of Ireland

  readonly mapOptions: google.maps.MapOptions = {
    center: this.defaultLocation,
    zoom: 7,
    mapId: 'GOOGLE_MAP'
  }

  readonly places$: Observable<Place[]> = this.placesFilterService.filters$.pipe(
    switchMap((filters) => this.placesService.getPlaces(filters))
  );
}
