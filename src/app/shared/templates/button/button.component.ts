import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'home-button',
  imports: [],
  templateUrl: './button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  label = input<string>('');
  type = input<'button' | 'submit' | 'reset'>('button');

  clicked = output<void>();
}
