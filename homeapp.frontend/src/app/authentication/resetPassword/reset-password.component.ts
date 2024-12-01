import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { PasswordConfirmationValidatorService } from '../../shared/custom-validators/password-confirmation-validator.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ResetPasswordDto } from '../../shared/models/authentication/resetPassword/reset-password-dto';
import { FormHelperService } from '../../shared/services/helper/form-helper.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'hoa-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  public resetPasswordForm: FormGroup;
  public errorMessage: string;
  public showSuccess: boolean;
  public showError: boolean;

  private fb = inject(FormBuilder);
  private token: string;
  private email: string;

  constructor(
    private authService: AuthenticationService,
    private formHelperService: FormHelperService,
    private passConfValidator: PasswordConfirmationValidatorService,
    private route: ActivatedRoute
  ) {
    this.resetPasswordForm = new FormGroup({});
    this.errorMessage = '';
    this.showSuccess = false;
    this.showError = false;
    this.token = '';
    this.email = '';
  }

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group<ResetPasswordDto>({
      password: this.fb.control('', { validators: [Validators.required], nonNullable: true }),
      confirmPassword: this.fb.control('', { nonNullable: true }),
      email: this.fb.control('', { validators: [Validators.required], nonNullable: true }),
      token: this.fb.control('', { validators: [Validators.required], nonNullable: true }),
    });

    this.resetPasswordForm.get('password')!.setValidators([Validators.required, this.passConfValidator.validateConfirmPassword(this.resetPasswordForm.get('confirmPassword')!)]);

    this.token = this.route.snapshot.queryParams['token'];
    this.email = this.route.snapshot.queryParams['email'];
  }

  public validateControl = (controlName: string) => {
    return this.formHelperService.defaultValidateControl(controlName, this.resetPasswordForm);
  };

  public hasError = (controlName: string, errorName: string) => {
    return this.formHelperService.defaultErroControl(controlName, errorName, this.resetPasswordForm);
  };

  public resetPassword = (resetPasswordFormValue: ResetPasswordDto) => {
    this.showError = this.showSuccess = false;
    const resetPass = { ...resetPasswordFormValue };
    const resetPassDto: ResetPasswordDto = {
      password: resetPass.password,
      confirmPassword: resetPass.confirmPassword,
      token: this.fb.control(this.token, { nonNullable: true }),
      email: this.fb.control(this.email, { nonNullable: true }),
    };
    this.authService.resetPassword('api/accounts/resetpassword', resetPassDto).subscribe({
      next: (_) => (this.showSuccess = true),
      error: (err: HttpErrorResponse) => {
        this.showError = true;
        this.errorMessage = err.message;
      },
    });
  };
}
