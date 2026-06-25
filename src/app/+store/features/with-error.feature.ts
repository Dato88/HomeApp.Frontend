import { patchState, signalStoreFeature, withMethods, withState } from '@ngrx/signals';

export interface ErrorState {
  error: string | null;
}

export function withErrorHandling() {
  return signalStoreFeature(
    withState<ErrorState>({ error: null }),
    withMethods((store) => ({
      _handleError(error: unknown): void {
        const message =
          error instanceof Error ? error.message : 'An unexpected error occurred';
        patchState(store, { error: message });
      },
    }))
  );
}
