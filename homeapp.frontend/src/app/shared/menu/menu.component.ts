import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'hoa-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {
  public isUserAuthenticated: boolean;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.isUserAuthenticated = false;
  }

  ngOnInit(): void {
    this.authService.authChanged.subscribe((res) => {
      this.isUserAuthenticated = res;
    });
  }

  public logout = () => {
    this.authService.logout();
    this.router.navigate(['']);
  };
}
