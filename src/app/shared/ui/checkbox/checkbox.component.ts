import { Component, input, model } from '@angular/core';

/**
 * Gestylte Checkbox mit echtem (unsichtbarem, fokussierbarem) Input
 * und sichtbarem Label. Stopgap, bis die homeapp-lib eine lib-checkbox hat.
 */
@Component({
  selector: 'home-checkbox',
  template: `
    <label class="checkbox">
      <span class="checkbox-control">
        <input
          type="checkbox"
          class="checkbox-input"
          [checked]="checked()"
          [disabled]="disabled()"
          (change)="onChange($event)" />
        <span class="checkbox-box" aria-hidden="true">
          <i class="bi bi-check-lg"></i>
        </span>
      </span>
      <span class="checkbox-label">{{ label() }}</span>
    </label>
  `,
  styles: `
    .checkbox {
      display: inline-flex;
      gap: var(--app-space-2);
      align-items: center;
      min-height: 2.5rem;
      cursor: pointer;

      &:has(.checkbox-input:disabled) {
        cursor: not-allowed;
        opacity: 0.55;
      }
    }

    .checkbox-control {
      position: relative;
      display: inline-flex;
    }

    .checkbox-input {
      position: absolute;
      inset: 0;
      z-index: 1;
      margin: 0;
      cursor: inherit;
      opacity: 0;
    }

    .checkbox-box {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.25rem;
      height: 1.25rem;
      color: transparent;
      background: var(--app-surface);
      border: 1px solid var(--app-border);
      border-radius: var(--app-radius-sm);
      transition: background-color 120ms ease, border-color 120ms ease;
    }

    .checkbox-input:checked + .checkbox-box {
      color: var(--app-primary-contrast);
      background: var(--app-primary);
      border-color: var(--app-primary);
    }

    .checkbox-input:focus-visible + .checkbox-box {
      outline: var(--app-focus-ring);
      outline-offset: 2px;
    }
  `,
})
export class CheckboxComponent {
  readonly label = input.required<string>();
  readonly disabled = input(false);
  readonly checked = model(false);

  protected onChange(event: Event): void {
    this.checked.set((event.target as HTMLInputElement).checked);
  }
}
