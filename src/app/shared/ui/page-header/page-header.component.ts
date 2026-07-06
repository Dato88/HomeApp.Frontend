import { Component, input } from '@angular/core';

/**
 * Einheitlicher Seitenkopf: genau ein h1 pro Seite plus rechtsbündiger
 * Aktions-Slot, der auf schmalen Screens unter den Titel umbricht.
 */
@Component({
  selector: 'home-page-header',
  template: `
    <header class="page-header">
      <div class="page-header-text">
        <h1 class="page-header-title" [attr.id]="headingId() || null">{{ title() }}</h1>
        @if (subtitle()) {
          <p class="page-header-subtitle">{{ subtitle() }}</p>
        }
      </div>
      <div class="page-header-actions">
        <ng-content />
      </div>
    </header>
  `,
  styles: `
    .page-header {
      display: flex;
      flex-wrap: wrap;
      gap: var(--app-space-2) var(--app-space-4);
      align-items: center;
      justify-content: space-between;
    }

    .page-header-title {
      margin: 0;
      font-size: var(--app-text-2xl);
    }

    .page-header-subtitle {
      margin: var(--app-space-1) 0 0;
      color: var(--app-text-muted);
    }

    .page-header-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--app-space-2);
      align-items: center;
    }
  `,
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input('');
  readonly headingId = input('');
}
