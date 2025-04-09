import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
  OnDestroy,
  PLATFORM_ID,
  viewChild
} from '@angular/core';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { GoogleMapsService } from '../../services/google-maps.service';
import { PlacesService } from '../../services/places.service';
import { AsyncPipe, isPlatformServer } from '@angular/common';
import { map, merge, Observable, switchMap, withLatestFrom } from 'rxjs';
import { Place } from '../../models/place.interface';
import { PlacesFilterService } from '../../services/places-filter.service';
import { PlaceTooltipService } from '../../services/place-tooltip.service';
import { FormsModule } from '@angular/forms';
import { SelectedMarkersService } from '../../services/selected-markers.service';
import { MapTravelMode } from "../../models/travel-mode.enum";
import { Marker } from "../../models/marker.interface";
import { MapControlsComponent } from "../map-controls/map-controls.component";
import { DirectionService } from "../../services/direction.service";

@Component({
  selector: 'app-google-map',
  imports: [
    GoogleMapsModule,
    AsyncPipe,
    FormsModule,
    MapControlsComponent
  ],
  templateUrl: './google-map.component.html',
  styleUrl: './google-map.component.scss',
  providers: [PlaceTooltipService, SelectedMarkersService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoogleMapComponent implements OnDestroy {
  private googleMapsService = inject(GoogleMapsService);
  private placesService = inject(PlacesService);
  private placesFilterService = inject(PlacesFilterService);
  private placeTooltipService = inject(PlaceTooltipService);
  private platformId = inject(PLATFORM_ID);
  private selectedMarkersService = inject(SelectedMarkersService);
  private directionService = inject(DirectionService);

  private googleMap = viewChild<GoogleMap>('googleMap');

  isGoogleMapsLoaded = this.googleMapsService.isLoaded;
  directionMode = model<boolean>(false);
  selectedMarkers = this.selectedMarkersService.selectedMarkers;
  travelMode = model<MapTravelMode>(MapTravelMode.DRIVING);

  private readonly defaultLocation: google.maps.LatLngLiteral = { lat: 53.4494762, lng: -7.5029786 }; // Geographical centre of Ireland

  readonly mapOptions: google.maps.MapOptions = {
    center: this.defaultLocation,
    zoom: 7,
    mapId: 'GOOGLE_MAP',
    gestureHandling: 'greedy'
  }

  readonly markerOptions: google.maps.marker.AdvancedMarkerElementOptions = {
    gmpClickable: true
  }

  readonly places$: Observable<Place[]> = this.getPlaces();

  constructor() {
    afterNextRender(async () => {
      await this.googleMapsService.loadGoogleMaps();
    });
  }

  onMarkerClick(e: google.maps.MapMouseEvent, place: Place): void {
    const el: HTMLElement | null = e.domEvent.target as HTMLElement;
    const googleMap: GoogleMap | undefined = this.googleMap();

    if (!el || !googleMap || isPlatformServer(this.platformId)) {
      return;
    }

    this.handleMarkerClick(el, place, googleMap);
  }

  onClearMultiplySelection(): void {
    this.clearMultiplySelection();
  }

  onDirectionModeChange(): void {
    if (this.directionMode()) {
      return;
    }

    this.clearMultiplySelection();
  }

  onTravelModeChange(): void {
    const googleMap: GoogleMap | undefined = this.googleMap();
    if (!googleMap || this.selectedMarkers().length < 2) {
      return;
    }

    this.setDirection(googleMap);
  }

  private handleMarkerClick(el: HTMLElement, place: Place, googleMap: GoogleMap): void {
    if (!this.directionMode()) {
      this.placeTooltipService.show(el, place, googleMap);
      return;
    }

    if (this.selectedMarkersService.hasMarker(el)) {
      return;
    }

    if (this.selectedMarkers().length === 2) {
      this.clearMultiplySelection();
      this.selectedMarkersService.selectMultiplyMarkers(el, place);
      return;
    }

    this.selectedMarkersService.selectMultiplyMarkers(el, place);

    if (this.selectedMarkers().length === 2) {
      this.setDirection(googleMap);
    }
  }

  private setDirection(googleMap: GoogleMap): void {
    const origin = this.getMarkerPosition(this.selectedMarkers()[0]);
    const destination = this.getMarkerPosition(this.selectedMarkers()[1]);

    this.directionService.calculateDirection(googleMap.googleMap, origin, destination, this.travelMode() as unknown as google.maps.TravelMode);
  }

  private getMarkerPosition(marker: Marker): google.maps.LatLngLiteral {
    const { latitude, longitude } = marker.place.geo;
    return { lat: latitude, lng: longitude };
  }

  private clearMultiplySelection(): void {
    this.selectedMarkersService.unselectAllMultiplyMarkers();
    this.directionService.clearDirection();
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

  ngOnDestroy(): void {
    this.placeTooltipService.cleanSubscriptions();
  }
}
