import { Component, input, output, signal, viewChild } from '@angular/core';
import { ButtonComponent, DialogComponent } from '@Dato88/homeapp-lib';

let nextConfirmDialogId = 0;

/**
 * Bestätigungsdialog für destruktive Aktionen. Aufrufer öffnen ihn mit
 * `open(context)` und erhalten den Kontext im `confirmed`-Event zurück —
 * kein separates "pending id"-Signal nötig.
 */
@Component({
  selector: 'home-confirm-dialog',
  imports: [DialogComponent, ButtonComponent],
  template: `
    <lib-dialog
      [isModal]="true"
      dialogClass="app-dialog app-dialog--narrow"
      [ariaLabelledBy]="titleId"
      (closed)="onClosed()">
      <h2 [id]="titleId" class="confirm-title">{{ title() }}</h2>
      @if (message()) {
        <p class="confirm-message">{{ message() }}</p>
      }
      <ng-content />
      <div class="confirm-actions">
        <lib-button [label]="cancelLabel()" (clicked)="close()"></lib-button>
        <button
          type="button"
          class="btn"
          [class.btn--danger]="destructive()"
          (click)="onConfirm()">
          {{ confirmLabel() }}
        </button>
      </div>
    </lib-dialog>
  `,
  styles: `
    .confirm-title {
      margin: 0 0 var(--app-space-2);
      font-size: var(--app-text-xl);
    }

    .confirm-message {
      margin: 0 0 var(--app-space-3);
      color: var(--app-text-muted);
    }

    .confirm-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--app-space-2);
      justify-content: flex-end;
      margin-top: var(--app-space-3);
    }
  `,
})
// Default `any`: Templates können keine Generics angeben; so bleiben
// Aufrufstellen wie `dialog.open(entity)` + `(confirmed)="delete($event)"`
// ohne $any-Casts typisierbar.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ConfirmDialogComponent<T = any> {
  readonly title = input('Wirklich löschen?');
  readonly message = input('');
  readonly confirmLabel = input('Löschen');
  readonly cancelLabel = input('Abbrechen');
  readonly destructive = input(true);

  readonly confirmed = output<T>();

  protected readonly titleId = `confirm-dialog-title-${nextConfirmDialogId++}`;

  private readonly dialog = viewChild.required(DialogComponent);
  private readonly context = signal<T | undefined>(undefined);

  open(context?: T): void {
    this.context.set(context);
    this.dialog().open();
  }

  close(): void {
    this.dialog().close();
  }

  protected onConfirm(): void {
    const context = this.context();
    this.close();
    this.confirmed.emit(context as T);
  }

  protected onClosed(): void {
    this.context.set(undefined);
  }
}
