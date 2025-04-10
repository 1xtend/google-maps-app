import { inject, Injectable, Renderer2, signal } from '@angular/core';
import { Place } from '../models/place.interface';
import { Marker } from "../models/marker.interface";

@Injectable({
  providedIn: 'root'
})
export class SelectedMarkersService {
  private renderer = inject(Renderer2);

  private _selectedMarker = signal<Marker | null>(null);
  selectedMarker = this._selectedMarker.asReadonly();

  private _selectedMarkers = signal<Marker[]>([]);
  selectedMarkers = this._selectedMarkers.asReadonly();

  selectMarker(markerEl: HTMLElement, place: Place): void {
    this.addClass(markerEl);
    this.updateMarkerSelection({ el: markerEl, place });
  }

  unselectMarker(): void {
    this.updateMarkerSelection(null);
  }

  selectMultiplyMarkers(markerEl: HTMLElement, place: Place): void {
    this.addClass(markerEl);

    this._selectedMarkers.update((prev) => {
      const marker: Marker = { el: markerEl, place };

      if (prev.length > 1) {
        prev.forEach((prevMarker) => this.removeClass(prevMarker.el));
        return [marker];
      }

      return [...prev, marker];
    })
  }

  unselectAllMultiplyMarkers(): void {
    this._selectedMarkers.update((prev) => {
      if (prev.length > 0) {
        prev.forEach((marker) => {
          this.removeClass(marker.el);
        })
      }

      return [];
    });
  }

  hasMarker(el: HTMLElement): boolean {
    return this._selectedMarkers().some((marker) => el === marker.el);
  }

  private updateMarkerSelection(marker: Marker | null): void {
    this._selectedMarker.update((prev) => {
      if (prev) {
        this.removeClass(prev.el);
      }

      return marker;
    });
  }

  private removeClass(markerEl: HTMLElement): void {
    this.renderer.removeClass(markerEl, 'active-marker');
  }

  private addClass(markerEl: HTMLElement): void {
    if (markerEl.classList.contains('active-marker')) {
      return;
    }

    this.renderer.addClass(markerEl, 'active-marker');
  }
}
