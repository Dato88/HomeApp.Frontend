import { Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthenticationService } from '../services/authentication.service';
import { Router, RouterModule } from '@angular/router';
import { UserStore } from '../../+store/user-store';
import { NavbarStore } from '../../+store/navbar-store';

@Component({
  selector: 'am-navbar',
  imports: [MatIconModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  readonly #authService = inject(AuthenticationService);
  readonly #router = inject(Router);
  readonly #userStore = inject(UserStore);
  readonly #navbarStore = inject(NavbarStore);

  user = computed(() => this.#userStore.user());
  navbarListItems = computed(() => this.#navbarStore.navbarListItems());

  clickNav(event: Event): void {
    const li = (event.currentTarget as HTMLElement).closest('li');
    li?.classList.toggle('showMenu');
  }

  clickNavBtn(): void {
    let sidebar = document.querySelector('.sidebar');
    sidebar?.classList.toggle('close');
  }

  public logout(): void {
    this.#authService.logout();
    this.#router.navigate(['authentication']);
  }
}
