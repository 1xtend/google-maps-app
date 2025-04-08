import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  inject, model,
  OnDestroy,
  PLATFORM_ID, signal,
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
import { MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { SelectedMarkersService } from '../../services/selected-markers.service';

@Component({
  selector: 'app-google-map',
  imports: [GoogleMapsModule, AsyncPipe, MatExpansionPanel, MatExpansionPanelHeader, MatCheckbox, FormsModule],
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

  private googleMap = viewChild<GoogleMap>('googleMap');

  isGoogleMapsLoaded = this.googleMapsService.isLoaded;
  directionMode = model<boolean>(false)
  selectedPlaces = signal<Place[]>([]);

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

  constructor() {
    afterNextRender(async () => {
      await this.googleMapsService.loadGoogleMaps();
    })
  }

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

  ngOnDestroy(): void {
    this.placeTooltipService.cleanSubscriptions();
  }
}
