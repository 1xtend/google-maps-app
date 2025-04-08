import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatAnchor, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

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
  menuButtonClick = output<Event>();
}
