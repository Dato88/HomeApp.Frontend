import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from '@Dato88/homeapp-lib';
import { UserStore } from './+store/user-store';
import { NavbarStore } from './+store/navbar-store';

@Component({
  selector: 'home-root',
  imports: [RouterOutlet, NavigationComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly userStore = inject(UserStore);
  readonly navbarStore = inject(NavbarStore);
}
