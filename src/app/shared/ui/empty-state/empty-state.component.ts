import { Component, input } from '@angular/core';

/**
 * Standardisierter Leerzustand: Icon, Titel, optionale Beschreibung und
 * projizierter CTA-Button. Auch für die [noEntries]-Projektion von lib-grid.
 */
@Component({
  selector: 'home-empty-state',
  template: `
    <div class="empty-state">
      <i class="bi empty-state-icon" [class]="icon()" aria-hidden="true"></i>
      <p class="empty-state-title">{{ title() }}</p>
      @if (description()) {
        <p class="empty-state-description">{{ description() }}</p>
      }
      <ng-content />
    </div>
  `,
  styles: `
    .empty-state {
      display: grid;
      gap: var(--app-space-2);
      justify-items: center;
      padding: var(--app-space-6) var(--app-space-4);
      text-align: center;
    }

    .empty-state-icon {
      font-size: 2.5rem;
      color: var(--app-text-muted);
    }

    .empty-state-title {
      margin: 0;
      font-size: var(--app-text-lg);
      font-weight: 600;
    }

    .empty-state-description {
      max-width: 40ch;
      margin: 0;
      color: var(--app-text-muted);
    }
  `,
})
export class EmptyStateComponent {
  readonly icon = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input('');
}
