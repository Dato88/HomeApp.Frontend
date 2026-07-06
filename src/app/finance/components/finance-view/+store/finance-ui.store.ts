import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export type FinanceTab = 'accounts' | 'transactions' | 'categories';

export interface FinanceUiState {
  activeTab: FinanceTab;
  transactionsAccountId: string;
  transactionsFromDate: string;
  transactionsToDate: string;
  transactionsUncategorizedOnly: boolean;
  transactionsPageIndex: number;
  categoriesHouseholdId: string;
}

export const FinanceUiStore = signalStore(
  withState<FinanceUiState>({
    activeTab: 'accounts',
    transactionsAccountId: '',
    transactionsFromDate: '',
    transactionsToDate: '',
    transactionsUncategorizedOnly: false,
    transactionsPageIndex: 0,
    categoriesHouseholdId: '',
  }),
  withMethods((store) => ({
    setActiveTab(tab: FinanceTab): void {
      patchState(store, { activeTab: tab });
    },

    setTransactionsAccountId(accountId: string): void {
      patchState(store, { transactionsAccountId: accountId, transactionsPageIndex: 0 });
    },

    setTransactionsFromDate(fromDate: string): void {
      patchState(store, { transactionsFromDate: fromDate, transactionsPageIndex: 0 });
    },

    setTransactionsToDate(toDate: string): void {
      patchState(store, { transactionsToDate: toDate, transactionsPageIndex: 0 });
    },

    setTransactionsUncategorizedOnly(uncategorizedOnly: boolean): void {
      patchState(store, { transactionsUncategorizedOnly: uncategorizedOnly, transactionsPageIndex: 0 });
    },

    setTransactionsPageIndex(pageIndex: number): void {
      patchState(store, { transactionsPageIndex: pageIndex });
    },

    setCategoriesHouseholdId(householdId: string): void {
      patchState(store, { categoriesHouseholdId: householdId });
    },

    hydrateFromDomain(patch: Partial<FinanceUiState>): void {
      patchState(store, patch);
    },
  }))
);
