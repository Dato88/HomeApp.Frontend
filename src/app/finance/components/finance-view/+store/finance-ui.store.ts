import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export type FinanceTab = 'accounts' | 'transactions' | 'categories' | 'report';

export interface FinanceUiState {
  activeTab: FinanceTab;
}

export const FinanceUiStore = signalStore(
  withState<FinanceUiState>({ activeTab: 'accounts' }),
  withMethods((store) => ({
    setActiveTab(tab: FinanceTab): void {
      patchState(store, { activeTab: tab });
    },
  }))
);
