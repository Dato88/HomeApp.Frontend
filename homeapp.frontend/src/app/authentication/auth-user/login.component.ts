import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserForAuthenticationDto } from '../../shared/models/authentication/auth/user-for-authentication-dto';
import { AuthResponseDto } from '../../shared/models/authentication/auth/auth-response-dto';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'hoa-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private returnUrl: string;

  public loginForm: FormGroup;
  public errorMessage: string;
  public showError: boolean;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.returnUrl = '';
    this.loginForm = new FormGroup({});
    this.errorMessage = '';
    this.showError = false;
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  validateControl = (controlName: string) => {
    return this.loginForm.get(controlName)?.invalid && this.loginForm.get(controlName)?.touched;
  };

  hasError = (controlName: string, errorName: string) => {
    return this.loginForm.get(controlName)?.hasError(errorName);
  };

  loginUser = (loginFormValue: FormGroup) => {
    this.showError = false;

    const login = { ...loginFormValue };
    const userForAuth: UserForAuthenticationDto = {
      email: login.value.username,
      password: login.value.password,
    };

    this.authService.loginUser('login', userForAuth).subscribe({
      next: (res: AuthResponseDto) => {
        localStorage.setItem('token', res.token);
        this.router.navigate([this.returnUrl]);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.message;
        this.showError = true;
      },
    });
  };
}
