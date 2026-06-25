import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'input-field',
  imports: [ReactiveFormsModule],
  templateUrl: './input-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './input-field.component.scss',
})
export class InputFieldComponent {
  identifier = input<string>();
  name = input<string>();
  label = input<string>();
  placeholder = input<string>('');
  required = input<boolean>(false);
  autofocus = input<boolean>(false);
  controlName = input<string>('');
}
