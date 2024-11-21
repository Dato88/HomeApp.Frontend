import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { UserForRegistrationDto } from '../../shared/models/user-for-registration-dto';
import { HttpErrorResponse } from '@angular/common/http';
import { PasswordConfirmationValidatorService } from '../../shared/custom-validators/password-confirmation-validator.service';

@Component({
  selector: 'hoa-register-user',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.scss',
})
export class RegisterUserComponent implements OnInit {
  public registerForm: FormGroup = new FormGroup({});
  public errorMessage: string = '';
  public showError: boolean = false;

  constructor(
    private authService: AuthenticationService,
    private passConfValidator: PasswordConfirmationValidatorService
  ) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl(''),
    });

    this.registerForm
      .get('password')!
      .setValidators([
        Validators.required,
        this.passConfValidator.validateConfirmPassword(this.registerForm.get('confirmPassword')!),
      ]);
  }

  public validateControl = (controlName: string) => {
    return (
      this.registerForm.get(controlName)?.invalid && this.registerForm.get(controlName)?.touched
    );
  };

  public hasError = (controlName: string, errorName: string) => {
    return this.registerForm.get(controlName)?.hasError(errorName);
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
    };

    this.authService.registerUser('authentication/register', user).subscribe({
      next: (_) => console.log('Successful registration'),
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.message;
        this.showError = true;
      },
    });
  };
}
