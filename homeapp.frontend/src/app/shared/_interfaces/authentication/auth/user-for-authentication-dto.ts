import { FormControl } from '@angular/forms';

export interface UserForAuthenticationDto {
  email: FormControl<string>;
  password: FormControl<string>;
  clientURI: string;
}
