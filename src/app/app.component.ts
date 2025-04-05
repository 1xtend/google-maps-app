import { afterNextRender, Component, inject } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { GoogleMapsService } from './feature/maps/services/google-maps.service';

@Component({
  selector: 'app-root',
  imports: [
    GoogleMapsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private googleMapsService = inject(GoogleMapsService)

  isGoogleMapsLoaded = this.googleMapsService.isGoogleMapsLoaded;

  constructor() {
    afterNextRender(async () => {
      await this.googleMapsService.loadGoogleMaps();
    });
  }
}
