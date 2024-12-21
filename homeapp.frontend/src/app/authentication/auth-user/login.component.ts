import { Component, inject, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserForAuthenticationDto } from '../../shared/_interfaces/authentication/auth/user-for-authentication-dto';
import { AuthResponseDto } from '../../shared/_interfaces/authentication/auth/auth-response-dto';
import { HttpErrorResponse } from '@angular/common/http';
import { FormHelperService } from '../../shared/services/helper/form-helper.service';
import { environment } from '../../../environments/environment';
import { API_AUTHENTICATION_ENDPOINTS } from '../../../api-endpoints/api-authentication-endpoints';
import { API_ACCOUNTS_ENDPOINTS } from '../../../api-endpoints/api-accounts-endpoints';

@Component({
    selector: 'hoa-login',
    imports: [ReactiveFormsModule, RouterModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private returnUrl: string;

  public loginForm: FormGroup;
  public errorMessage: string;
  public showError: boolean;

  private fb = inject(FormBuilder);
  readonly #authService = inject(AuthenticationService);
  readonly #formHelperService = inject(FormHelperService);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);

  constructor() {
    this.returnUrl = '';
    this.loginForm = new FormGroup({});
    this.errorMessage = '';
    this.showError = false;
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group<UserForAuthenticationDto>({
      email: this.fb.control('', { validators: [Validators.required], nonNullable: true }),
      password: this.fb.control('', { validators: [Validators.required], nonNullable: true }),
      clientURI: '',
    });

    this.returnUrl = this.#route.snapshot.queryParams['returnUrl'] || '/';
  }

  public validateControl = (controlName: string) => {
    return this.#formHelperService.defaultValidateControl(controlName, this.loginForm);
  };

  public hasError = (controlName: string, errorName: string) => {
    return this.#formHelperService.defaultErroControl(controlName, errorName, this.loginForm);
  };

  loginUser = (loginFormValue: UserForAuthenticationDto) => {
    this.showError = false;

    const login = { ...loginFormValue };
    const userForAuth: UserForAuthenticationDto = {
      email: login.email,
      password: login.password,
      clientURI: `${environment.baseUrl}/${API_AUTHENTICATION_ENDPOINTS.forgotPassword}`,
    };

    this.#authService.loginUser(userForAuth).subscribe({
      next: (res: AuthResponseDto) => {
        if (res.is2StepVerificationRequired) {
          this.#router.navigate([`/${API_ACCOUNTS_ENDPOINTS.twoStepVerification}`], {
            queryParams: {
              returnUrl: this.returnUrl,
              provider: res.provider,
              email: userForAuth.email,
            },
          });
        } else {
          localStorage.setItem('token', res.token);
          this.#authService.sendAuthStateChangeNotification(res.isAuthSuccessful);
          this.#router.navigate([this.returnUrl]);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.message;
        this.showError = true;
      },
    });
  };
}
