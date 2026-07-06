import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export type BudgetViewMode = 'editor' | 'eva';

export interface BudgetUiState {
  mode: BudgetViewMode;
  selectedMonth: number;
}

const currentMonth = new Date().getMonth() + 1;

export const BudgetUiStore = signalStore(
  withState<BudgetUiState>({ mode: 'editor', selectedMonth: currentMonth }),
  withMethods((store) => ({
    setMode(mode: BudgetViewMode): void {
      patchState(store, { mode });
    },

    setSelectedMonth(month: number): void {
      if (month >= 1 && month <= 12) {
        patchState(store, { selectedMonth: month });
      }
    },

    prevMonth(): void {
      const month = store.selectedMonth();
      patchState(store, { selectedMonth: month <= 1 ? 12 : month - 1 });
    },

    nextMonth(): void {
      const month = store.selectedMonth();
      patchState(store, { selectedMonth: month >= 12 ? 1 : month + 1 });
    },
  }))
);
