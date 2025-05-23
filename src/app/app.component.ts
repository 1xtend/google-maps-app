import { Component, inject } from '@angular/core';
import { NavbarComponent } from './shared/layout/navbar/navbar.component';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { SidenavComponent } from './shared/layout/sidenav/sidenav.component';
import { RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterUtilsService } from './core/services/router-utils.service';

@Component({
  selector: 'app-root',
  imports: [
    NavbarComponent,
    MatSidenavContainer,
    MatSidenavContent,
    MatSidenav,
    SidenavComponent,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private routerUtilsService = inject(RouterUtilsService);

  sidenavFullHeight = toSignal<boolean>(this.routerUtilsService.hasRoute('/'));
}
