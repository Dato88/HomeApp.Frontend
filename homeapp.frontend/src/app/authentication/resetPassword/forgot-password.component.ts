import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { ForgotPasswordDto } from '../../shared/_interfaces/authentication/auth/resetPassword/forgot-password-dto';
import { FormHelperService } from '../../shared/services/helper/form-helper.service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { API_AUTHENTICATION_ENDPOINTS } from '../../../api-endpoints/api-authentication-endpoints';

@Component({
    selector: 'hoa-forgot-password',
    imports: [ReactiveFormsModule],
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit {
  readonly #authService = inject(AuthenticationService);
  readonly #formHelperService = inject(FormHelperService);

  public forgotPasswordForm: FormGroup;
  public successMessage: string;
  public errorMessage: string;
  public showSuccess: boolean;
  public showError: boolean;

  private fb = inject(FormBuilder);

  constructor() {
    this.forgotPasswordForm = new FormGroup({});
    this.successMessage = '';
    this.errorMessage = '';
    this.showSuccess = false;
    this.showError = false;
  }

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group<ForgotPasswordDto>({
      email: this.fb.control('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      clientURI: '',
    });
  }

  public validateControl = (controlName: string) => {
    return this.#formHelperService.defaultValidateControl(controlName, this.forgotPasswordForm);
  };

  public hasError = (controlName: string, errorName: string) => {
    return this.#formHelperService.defaultErroControl(
      controlName,
      errorName,
      this.forgotPasswordForm
    );
  };

  public forgotPassword = (forgotPasswordFormValue: ForgotPasswordDto) => {
    this.showError = this.showSuccess = false;

    const clientURI = `${environment.baseUrl}/${API_AUTHENTICATION_ENDPOINTS.resetPassword}`;

    const forgotPassDto: ForgotPasswordDto = {
      email: forgotPasswordFormValue.email,
      clientURI: clientURI,
    };

    this.#authService.forgotPassword(forgotPassDto).subscribe({
      next: (_) => {
        this.showSuccess = true;
        this.successMessage =
          'The link has been sent, please check your email to reset your password.';
      },
      error: (err: HttpErrorResponse) => {
        this.showError = true;
        this.errorMessage = err.message;
      },
    });
  };
}
