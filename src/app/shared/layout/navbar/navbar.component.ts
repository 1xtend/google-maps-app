import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatAnchor, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterUtilsService } from '../../../core/services/router-utils.service';

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
  private routerUtilsService = inject(RouterUtilsService);

  menuButtonClick = output<Event>();

  showMenuButton = toSignal<boolean>(this.routerUtilsService.hasRoute('/'));
}
