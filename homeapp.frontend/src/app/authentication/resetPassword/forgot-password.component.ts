import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { ForgotPasswordDto } from '../../shared/models/authentication/resetPassword/forgot-password-dto';
import { FormHelperService } from '../../shared/services/helper/form-helper.service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'hoa-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnInit {
  public forgotPasswordForm: FormGroup;
  public successMessage: string;
  public errorMessage: string;
  public showSuccess: boolean;
  public showError: boolean;

  private fb = inject(FormBuilder);

  constructor(
    private authService: AuthenticationService,
    private formHelperService: FormHelperService
  ) {
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
    return this.formHelperService.defaultValidateControl(controlName, this.forgotPasswordForm);
  };

  public hasError = (controlName: string, errorName: string) => {
    return this.formHelperService.defaultErroControl(controlName, errorName, this.forgotPasswordForm);
  };

  public forgotPassword = (forgotPasswordFormValue: ForgotPasswordDto) => {
    this.showError = this.showSuccess = false;

    const clientURI = `${environment.baseUrl}/authentication/resetpassword`;

    const forgotPassDto: ForgotPasswordDto = {
      email: forgotPasswordFormValue.email,
      clientURI: clientURI,
    };

    this.authService.forgotPassword('accounts/forgotpassword', forgotPassDto).subscribe({
      next: (_) => {
        this.showSuccess = true;
        this.successMessage = 'The link has been sent, please check your email to reset your password.';
      },
      error: (err: HttpErrorResponse) => {
        this.showError = true;
        this.errorMessage = err.message;
      },
    });
  };
}
