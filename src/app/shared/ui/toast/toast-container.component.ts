import { Component, inject } from '@angular/core';
import { Toast, ToastService } from './toast.service';

@Component({
  selector: 'home-toast-container',
  template: `
    <div class="toast-stack" role="status" aria-live="polite">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="toast"
          [class.toast--success]="toast.type === 'success'"
          [class.toast--error]="toast.type === 'error'"
          [attr.role]="toast.type === 'error' ? 'alert' : null">
          <i class="bi toast-icon" [class]="iconFor(toast)" aria-hidden="true"></i>
          <p class="toast-message">{{ toast.message }}</p>
          <button
            type="button"
            class="icon-button toast-dismiss"
            aria-label="Meldung schließen"
            (click)="toastService.dismiss(toast.id)">
            <i class="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        </div>
      }
    </div>
  `,
  styleUrl: './toast-container.component.scss',
})
export class ToastContainerComponent {
  protected readonly toastService = inject(ToastService);

  protected iconFor(toast: Toast): string {
    switch (toast.type) {
      case 'success':
        return 'bi-check-circle-fill';
      case 'error':
        return 'bi-exclamation-triangle-fill';
      default:
        return 'bi-info-circle-fill';
    }
  }
}
