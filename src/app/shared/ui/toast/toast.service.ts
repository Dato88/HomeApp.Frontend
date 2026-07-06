import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  readonly id: number;
  readonly type: ToastType;
  readonly message: string;
}

const DISMISS_AFTER_MS: Record<ToastType, number> = {
  success: 5000,
  info: 5000,
  error: 8000,
};

const MAX_TOASTS = 3;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastsState = signal<Toast[]>([]);
  readonly toasts = this.toastsState.asReadonly();

  private nextId = 0;

  success(message: string): void {
    this.show('success', message);
  }

  error(message: string): void {
    this.show('error', message);
  }

  info(message: string): void {
    this.show('info', message);
  }

  dismiss(id: number): void {
    this.toastsState.update(toasts => toasts.filter(toast => toast.id !== id));
  }

  private show(type: ToastType, message: string): void {
    const toast: Toast = { id: this.nextId++, type, message };
    this.toastsState.update(toasts => [...toasts, toast].slice(-MAX_TOASTS));
    setTimeout(() => this.dismiss(toast.id), DISMISS_AFTER_MS[type]);
  }
}
