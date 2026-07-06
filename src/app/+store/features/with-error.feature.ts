import { inject } from '@angular/core';
import { patchState, signalStoreFeature, withMethods, withState } from '@ngrx/signals';
import { ToastService } from '../../shared/ui/toast/toast.service';

export interface ErrorState {
  error: string | null;
}

export function withErrorHandling() {
  return signalStoreFeature(
    withState<ErrorState>({ error: null }),
    withMethods((store, toast = inject(ToastService)) => ({
      _handleError(error: unknown): void {
        const message =
          error instanceof Error ? error.message : 'Ein unerwarteter Fehler ist aufgetreten';
        patchState(store, { error: message });
        toast.error(message);
      },
    }))
  );
}
