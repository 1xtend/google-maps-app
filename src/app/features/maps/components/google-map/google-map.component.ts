import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID, viewChild } from '@angular/core';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { GoogleMapsService } from '../../services/google-maps.service';
import { PlacesService } from '../../services/places.service';
import { AsyncPipe, isPlatformServer } from '@angular/common';
import { map, merge, Observable, switchMap, withLatestFrom } from 'rxjs';
import { Place } from '../../models/place.interface';
import { PlacesFilterService } from '../../services/places-filter.service';
import { PlaceTooltipService } from '../../services/place-tooltip.service';

@Component({
  selector: 'app-google-map',
  imports: [GoogleMapsModule, AsyncPipe],
  templateUrl: './google-map.component.html',
  styleUrl: './google-map.component.scss',
  providers: [PlaceTooltipService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoogleMapComponent {
  private googleMapsService = inject(GoogleMapsService);
  private placesService = inject(PlacesService);
  private placesFilterService = inject(PlacesFilterService);
  private placeTooltipService = inject(PlaceTooltipService);
  private platformId = inject(PLATFORM_ID);

  private googleMap = viewChild<GoogleMap>('googleMap')

  isGoogleMapsLoaded = this.googleMapsService.isGoogleMapsLoaded;

  private readonly defaultLocation: google.maps.LatLngLiteral = { lat: 53.4494762, lng: -7.5029786 }; // Geographical centre of Ireland

  readonly mapOptions: google.maps.MapOptions = {
    center: this.defaultLocation,
    zoom: 7,
    mapId: 'GOOGLE_MAP'
  }

  readonly markerOptions: google.maps.marker.AdvancedMarkerElementOptions = {
    gmpClickable: true
  }

  readonly places$: Observable<Place[]> = this.getPlaces();

  onMarkerClick(e: google.maps.MapMouseEvent, place: Place): void {
    const el: HTMLElement | null = e.domEvent.target as HTMLElement;
    const googleMap: GoogleMap | undefined = this.googleMap();

    if (!el || !googleMap || isPlatformServer(this.platformId)) {
      return;
    }

    this.placeTooltipService.show(el, place, googleMap, e.domEvent as PointerEvent);
  }

  private getPlaces(): Observable<Place[]> {
    return merge(
      this.placesFilterService.filters$,
      this.placesService.reload$.pipe(
        withLatestFrom(this.placesFilterService.filters$),
        map(([_, filters]) => filters)
      )
    ).pipe(switchMap((filters) => this.placesService.getPlaces(filters)))
  }
}
