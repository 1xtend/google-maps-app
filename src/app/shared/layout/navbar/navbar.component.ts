import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatAnchor, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { distinctUntilChanged, filter, map, Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navbar',
  imports: [
    MatToolbar,
    MatIconButton,
    MatIcon,
    RouterLink,
    MatAnchor
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  private router = inject(Router);

  menuButtonClick = output<Event>();

  isMenuButtonShown = toSignal<boolean>(this.showMenuButton());

  private showMenuButton(): Observable<boolean> {
    return this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.url.length === 1),
      distinctUntilChanged()
    );
  }
}
