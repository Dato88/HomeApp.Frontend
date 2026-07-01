import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from '@Dato88/homeapp-lib';
import { NavbarStore } from '../+store/navbar-store';
import { UserStore } from '../+store/user-store';

@Component({
  selector: 'home-app-shell',
  imports: [RouterOutlet, NavigationComponent],
  templateUrl: './app-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent {
  readonly userStore = inject(UserStore);
  readonly navbarStore = inject(NavbarStore);
}
