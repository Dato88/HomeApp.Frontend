import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormHelperService {
  constructor() {}

  public defaultValidateControl(controlName: string, registerForm: FormGroup) {
    return registerForm.get(controlName)?.invalid && registerForm.get(controlName)?.touched;
  }

  public defaultErroControl(controlName: string, errorName: string, registerForm: FormGroup) {
    return registerForm.get(controlName)?.hasError(errorName);
  }
}
