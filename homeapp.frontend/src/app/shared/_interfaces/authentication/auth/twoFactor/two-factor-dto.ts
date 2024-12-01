import { FormControl } from '@angular/forms';

export interface TwoFactorDto {
  email: string;
  provider: string;
  token: string;
}
