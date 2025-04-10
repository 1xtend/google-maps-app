import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DirectionService {
  private directionsRenderer: google.maps.DirectionsRenderer | null = null;

  calculateDirection(map: google.maps.Map | undefined, origin: google.maps.LatLngLiteral, destination: google.maps.LatLngLiteral, travelMode: google.maps.TravelMode): void {
    this.clearDirection();

    const directionService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({ map });

    this.displayDirection(directionService, { origin, destination, travelMode });
  }

  clearDirection(): void {
    if (!this.directionsRenderer) {
      return;
    }

    this.directionsRenderer.setMap(null);
    this.directionsRenderer = null;
  }

  private displayDirection(directionService: google.maps.DirectionsService, request: google.maps.DirectionsRequest): void {
    directionService.route(request, (response, status) => {
      if (status !== google.maps.DirectionsStatus.OK) {
        return;
      }

      this.directionsRenderer?.setDirections(response);
    });
  }
}
