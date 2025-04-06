import { afterNextRender, Component, inject } from '@angular/core';
import { GoogleMapsService } from './features/maps/services/google-maps.service';
import { MatToolbar } from '@angular/material/toolbar';
import { GoogleMapComponent } from './features/maps/components/google-map/google-map.component';

@Component({
  selector: 'app-root',
  imports: [
    MatToolbar,
    GoogleMapComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private googleMapsService = inject(GoogleMapsService)

  constructor() {
    afterNextRender(async () => {
      await this.googleMapsService.loadGoogleMaps();
    });
  }
}
