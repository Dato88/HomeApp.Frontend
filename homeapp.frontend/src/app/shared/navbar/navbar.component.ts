import { Component, inject, Inject, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavbarService } from '../services/navbar/navbar.service';
import { NavbarItem } from '../_interfaces/navbar/navbar-item';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'am-navbar',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @Input() navbarItem: NavbarItem;
  readonly #authService = inject(AuthenticationService);
  readonly #router = inject(Router);

  constructor(private service: NavbarService) {
    this.navbarItem = this.service.getAll();
  }

  clickNav(event: any) {
    let arrow = event;
    arrow.target.parentElement.parentElement.parentElement.classList.toggle('showMenu');
  }

  clickNavBtn() {
    let sidebar = document.querySelector('.sidebar');
    sidebar?.classList.toggle('close');
  }

  public logout = () => {
    this.#authService.logout();
    this.#router.navigate(['authentication']);
  };
}
