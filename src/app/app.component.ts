import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavigationComponent } from '@Dato88/homeapp-lib';
import { filter, map, startWith } from 'rxjs';
import { UserStore } from './+store/user-store';
import { NavbarStore } from './+store/navbar-store';
import { AuthStore } from './core/auth/auth-store';

@Component({
  selector: 'home-root',
  imports: [RouterOutlet, NavigationComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly authStore = inject(AuthStore);
  readonly userStore = inject(UserStore);
  readonly navbarStore = inject(NavbarStore);
  readonly #router = inject(Router);

  protected readonly showNavigation = toSignal(
    this.#router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => !this.#router.url.startsWith('/authentication')),
      startWith(!this.#router.url.startsWith('/authentication'))
    ),
    { initialValue: !this.#router.url.startsWith('/authentication') }
  );
}
