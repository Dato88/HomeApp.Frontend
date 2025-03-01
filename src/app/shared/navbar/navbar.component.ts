import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavbarService } from '../services/navbar/navbar.service';
import { NavbarItem } from '../_interfaces/navbar/navbar-item';
import { AuthenticationService } from '../services/authentication.service';
import { Router, RouterModule } from '@angular/router';
import { UserStore } from '../../+store/user-store';
import { map, timeInterval } from 'rxjs';

@Component({
  selector: 'am-navbar',
  imports: [MatIconModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  @Input() navbarItem!: NavbarItem;
  readonly #authService = inject(AuthenticationService);
  readonly #router = inject(Router);
  readonly #service = inject(NavbarService);
  readonly #store = inject(UserStore);

  user = computed(() => this.#store.user());

  ngOnInit(): void {
    this.navbarItem = this.#service.getAll();
    this.#service.getNavbarItems();
  }

  clickNav(event: any): void {
    let arrow = event;
    arrow.target.parentElement.parentElement.parentElement.classList.toggle('showMenu');
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
