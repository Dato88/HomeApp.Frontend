import { Component, inject, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavbarService } from '../services/navbar/navbar.service';
import { NavbarItem } from '../_interfaces/navbar/navbar-item';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'am-navbar',
  imports: [MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  @Input() navbarItem!: NavbarItem;
  readonly #authService = inject(AuthenticationService);
  readonly #router = inject(Router);
  readonly #service = inject(NavbarService);

  constructor() {
    // Der Konstruktor bleibt schlank – nur für Dependency Injection
  }

  ngOnInit(): void {
    // Initialisierungslogik wird hier ausgeführt
    this.navbarItem = this.#service.getAll();
    this.#service.getNavbarItems(); // API-Aufruf für Navbar-Items
    this.#service.getPerson(); // API-Aufruf für Personen-Daten
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
