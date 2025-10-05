import { Component, input } from '@angular/core';

@Component({
  selector: 'input-field',
  imports: [],
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.scss',
})
export class InputFieldComponent {
  identifier = input<string>();
  name = input<string>();
  label = input<string>();
  placeholder = input<string>('');
  required = input<boolean>(false);
  autofocus = input<boolean>(false);
}
