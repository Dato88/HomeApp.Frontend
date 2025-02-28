import { FormControl } from '@angular/forms';

export interface ResetPasswordDto {
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
  email: FormControl<string>;
  token: FormControl<string>;
}
