import { Routes } from '@angular/router';
import { GoogleMapComponent } from './features/maps/components/google-map/google-map.component';

export const routes: Routes = [
  {
    path: '',
    component: GoogleMapComponent
  },
  {
    path: 'place-details/:placeId',
    loadComponent: () => import('./features/maps/components/place-details/place-details.component').then((c) => c.PlaceDetailsComponent)
  }
];
