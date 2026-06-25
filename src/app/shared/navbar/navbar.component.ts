import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { UserStore } from '../../+store/user-store';
import { NavbarStore } from '../../+store/navbar-store';

@Component({
  selector: 'am-navbar',
  imports: [MatIconModule, RouterModule],
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
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
}
