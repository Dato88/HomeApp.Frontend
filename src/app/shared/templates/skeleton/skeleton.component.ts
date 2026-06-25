import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'home-skeleton',
  imports: [],
  templateUrl: './skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './skeleton.component.scss',
})
export class SkeletonComponent {
  variant = input<'text' | 'body' | 'footer'>('text');

  cssClass = computed(() => {
    switch (this.variant()) {
      case 'body':
        return 'skeleton-text-body';
      case 'footer':
        return 'skeleton skeleton-footer';
      default:
        return 'skeleton skeleton-text';
    }
  });
}
