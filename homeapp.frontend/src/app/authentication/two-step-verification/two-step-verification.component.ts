import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TwoFactorDto } from '../../shared/_interfaces/authentication/auth/twoFactor/two-factor-dto';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthResponseDto } from '../../shared/_interfaces/authentication/auth/auth-response-dto';
import { FormHelperService } from '../../shared/services/helper/form-helper.service';

@Component({
  selector: 'hoa-two-step-verification',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './two-step-verification.component.html',
  styleUrl: './two-step-verification.component.scss',
})
export class TwoStepVerificationComponent implements OnInit {
  readonly #authService = inject(AuthenticationService);
  readonly #route = inject(ActivatedRoute);
  readonly #formHelperService = inject(FormHelperService);
  readonly #router = inject(Router);

  private provider: string;
  private email: string;
  private returnUrl: string;

  twoStepForm: FormGroup;
  showError: boolean;
  errorMessage: string;

  private fb = inject(FormBuilder);

  constructor() {
    this.provider = '';
    this.email = '';
    this.returnUrl = '';
    this.twoStepForm = new FormGroup({});
    this.errorMessage = '';
    this.showError = false;
  }

  ngOnInit(): void {
    this.twoStepForm = this.fb.group({
      twoFactorCode: this.fb.control('', { validators: [Validators.required], nonNullable: true }),
    });

    this.provider = this.#route.snapshot.queryParams['provider'];
    this.email = this.#route.snapshot.queryParams['email'];
    this.returnUrl = this.#route.snapshot.queryParams['returnUrl'];
  }

  public validateControl = (controlName: string) => {
    return this.#formHelperService.defaultValidateControl(controlName, this.twoStepForm);
  };

  public hasError = (controlName: string, errorName: string) => {
    return this.#formHelperService.defaultErroControl(controlName, errorName, this.twoStepForm);
  };

  loginUser = (twoStepFromValue: any) => {
    this.showError = false;

    const formValue = { ...twoStepFromValue };
    let twoFactorDto: TwoFactorDto = {
      email: this.email,
      provider: this.provider,
      token: formValue.twoFactorCode,
    };
    this.#authService.twoStepLogin(twoFactorDto).subscribe({
      next: (res: AuthResponseDto) => {
        localStorage.setItem('token', res.token);
        this.#authService.sendAuthStateChangeNotification(res.isAuthSuccessful);
        this.#router.navigate([this.returnUrl]);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.message;
        this.showError = true;
      },
    });
  };
}
