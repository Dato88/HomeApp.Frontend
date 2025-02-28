import { FormControl } from '@angular/forms';

export interface ForgotPasswordDto {
  email: FormControl<string>;
  clientURI: string;
}
