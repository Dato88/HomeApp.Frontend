import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthenticationService } from './shared/services/authentication.service';
import { NavbarComponent } from './shared/navbar/navbar.component';

@Component({
  selector: 'hoa-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthenticationService) {}

  ngOnInit(): void {
    if (this.authService.isUserAuthenticated()) {
      this.authService.sendAuthStateChangeNotification(true);
    }
  }
}
