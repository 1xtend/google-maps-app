import { inject, Injectable, Renderer2, signal } from '@angular/core';
import { Place } from '../models/place.interface';

interface Marker {
  el: HTMLElement;
  place: Place
}

@Injectable({
  providedIn: 'root'
})
export class SelectedMarkersService {
  private renderer = inject(Renderer2);

  private selectedMarker = signal<Marker | null>(null);

  selectMarker(markerEl: HTMLElement, place: Place): void {
    this.addClass(markerEl);
    this.updateMarkerSelection({ el: markerEl, place });
  }

  unselectMarker(): void {
    this.updateMarkerSelection(null);
  }

  getSelectedMarker(): Marker | null {
    return this.selectedMarker();
  }

  private updateMarkerSelection(marker: Marker | null): void {
    this.selectedMarker.update((prev) => {
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
