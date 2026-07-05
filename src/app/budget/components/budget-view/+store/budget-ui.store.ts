import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export type BudgetViewMode = 'editor' | 'eva';

export interface BudgetUiState {
  mode: BudgetViewMode;
}

export const BudgetUiStore = signalStore(
  withState<BudgetUiState>({ mode: 'editor' }),
  withMethods((store) => ({
    setMode(mode: BudgetViewMode): void {
      patchState(store, { mode });
    },
  }))
);
