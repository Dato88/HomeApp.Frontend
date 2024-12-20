import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'hoa-email-confirmation',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './email-confirmation.component.html',
  styleUrl: './email-confirmation.component.scss',
})
export class EmailConfirmationComponent implements OnInit {
  public showSuccess: boolean;
  public showError: boolean;
  public errorMessage: string;

  constructor(
    private authService: AuthenticationService,
    private route: ActivatedRoute
  ) {
    this.showSuccess = false;
    this.errorMessage = '';
    this.showError = false;
  }

  ngOnInit(): void {
    this.confirmEmail();
  }

  private confirmEmail = () => {
    this.showError = this.showSuccess = false;
    const token = this.route.snapshot.queryParams['token'];
    const email = this.route.snapshot.queryParams['email'];

    this.authService.confirmEmail('accounts/emailconfirmation', token, email).subscribe({
      next: (_) => (this.showSuccess = true),
      error: (err: HttpErrorResponse) => {
        this.showError = true;
        this.errorMessage = err.message;
      },
    });
  };
}
