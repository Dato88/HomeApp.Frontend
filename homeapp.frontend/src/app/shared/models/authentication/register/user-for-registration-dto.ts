import { FormControl } from '@angular/forms';

export interface UserForRegistrationDto {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
  clientURI: string;
}
