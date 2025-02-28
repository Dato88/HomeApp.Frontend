import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { UserForRegistrationDto } from '../../shared/_interfaces/authentication/auth/register/user-for-registration-dto';
import { HttpErrorResponse } from '@angular/common/http';
import { PasswordConfirmationValidatorService } from '../../shared/custom-validators/password-confirmation-validator.service';
import { FormHelperService } from '../../shared/services/helper/form-helper.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'hoa-register-user',
    imports: [ReactiveFormsModule],
    templateUrl: './register-user.component.html',
    styleUrl: './register-user.component.scss'
})
export class RegisterUserComponent implements OnInit {
  readonly #authService = inject(AuthenticationService);
  readonly #router = inject(Router);
  readonly #formHelperService = inject(FormHelperService);
  readonly #passConfValidator = inject(PasswordConfirmationValidatorService);

  public registerForm: FormGroup;
  public errorMessage: string;
  public showError: boolean;

  private fb = inject(FormBuilder);

  constructor() {
    this.registerForm = new FormGroup({});
    this.errorMessage = '';
    this.showError = false;
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group<UserForRegistrationDto>({
      firstName: this.fb.control('', { nonNullable: true }),
      lastName: this.fb.control('', { nonNullable: true }),
      email: this.fb.control('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
      password: this.fb.control('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      confirmPassword: this.fb.control('', { nonNullable: true }),
      clientURI: `${environment.baseUrl}/authentication/emailconfirmation`,
    });

    this.registerForm
      .get('password')!
      .setValidators([
        Validators.required,
        this.#passConfValidator.validateConfirmPassword(this.registerForm.get('confirmPassword')!),
      ]);
  }

  public validateControl = (controlName: string) => {
    return this.#formHelperService.defaultValidateControl(controlName, this.registerForm);
  };

  public hasError = (controlName: string, errorName: string) => {
    return this.#formHelperService.defaultErroControl(controlName, errorName, this.registerForm);
  };

  public registerUser = (registerFormValue: UserForRegistrationDto) => {
    this.showError = false;

    const formValues = { ...registerFormValue };
    const user: UserForRegistrationDto = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      password: formValues.password,
      confirmPassword: formValues.confirmPassword,
      clientURI: '',
    };

    this.#authService.registerUser(user).subscribe({
      next: (_) => this.#router.navigate(['/authentication']),
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.message;
        this.showError = true;
      },
    });
  };
}
