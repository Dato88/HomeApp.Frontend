import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthenticationService } from './shared/services/authentication.service';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { LoginComponent } from './authentication/auth-user/login.component';

@Component({
  selector: 'hoa-root',
  imports: [RouterOutlet, RouterModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  readonly #authService = inject(AuthenticationService);

  public isUserAuthenticated: boolean;

  constructor() {
    this.isUserAuthenticated = false;
    this.#authService.authChanged.subscribe((res) => {
      this.isUserAuthenticated = res;
    });
  }

  ngOnInit(): void {
    if (this.#authService.isUserAuthenticated()) {
      this.#authService.sendAuthStateChangeNotification(true);
    }
  }
}
