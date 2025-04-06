import { afterNextRender, Component, inject } from '@angular/core';
import { GoogleMapsService } from './features/maps/services/google-maps.service';
import { GoogleMapComponent } from './features/maps/components/google-map/google-map.component';
import { NavbarComponent } from './shared/layout/navbar/navbar.component';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { SidenavComponent } from './shared/layout/sidenav/sidenav.component';

@Component({
  selector: 'app-root',
  imports: [
    GoogleMapComponent,
    NavbarComponent,
    MatSidenavContainer,
    MatSidenavContent,
    MatSidenav,
    SidenavComponent
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
