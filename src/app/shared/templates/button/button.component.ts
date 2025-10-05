import { Component, input, output } from '@angular/core';

@Component({
  selector: 'home-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  label = input<string>('');
  type = input<'button' | 'submit' | 'reset'>('button');

  clicked = output<void>();
}
