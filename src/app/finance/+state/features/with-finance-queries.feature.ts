import { ResourceRef } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { patchState, signalStoreFeature, type, withMethods, withProps } from '@ngrx/signals';
import { map, of } from 'rxjs';
import { AccountService } from '../../services/account.service';
import { CategoryService } from '../../services/category.service';
import { TransactionService } from '../../services/transaction.service';
import { AccountDto, CategoryDto, TransactionFilter, TransactionListResponse } from '../models';

export interface FinanceQueryState {
  selectedAccountId: string;
  selectedHouseholdId: number | undefined;
  transactionFilter: TransactionFilter | undefined;
}

export function withFinanceQueries() {
  return signalStoreFeature(
    {
      props: type<{
        _accountService: AccountService;
        _categoryService: CategoryService;
        _transactionService: TransactionService;
      }>(),
      state: type<FinanceQueryState>(),
    },
    withProps((store) => ({
      accountsResource: rxResource({
        stream: () =>
          store._accountService
            .getAccounts()
            .pipe(map((result) => (result.isSuccess ? result.value : []))),
      }) as ResourceRef<AccountDto[]>,
      categoriesResource: rxResource({
        params: () => {
          const householdId = store.selectedHouseholdId();
          return householdId ? { householdId } : undefined;
        },
        stream: ({ params }) =>
          store._categoryService
            .getCategories(params.householdId)
            .pipe(map((result) => (result.isSuccess ? result.value : []))),
      }) as ResourceRef<CategoryDto[]>,
      transactionsResource: rxResource({
        params: () => store.transactionFilter(),
        stream: ({ params }) => {
          if (!params) {
            return of({ totalCount: 0, transactions: [] } satisfies TransactionListResponse);
          }

          return store._transactionService
            .getTransactions(params)
            .pipe(
              map((result) =>
                result.isSuccess ? result.value : { totalCount: 0, transactions: [] }
              )
            );
        },
      }) as ResourceRef<TransactionListResponse>,
    })),
    withMethods((store) => ({
      setSelectedAccountId(accountId: string): void {
        patchState(store, { selectedAccountId: accountId });
      },
      setSelectedHouseholdId(householdId: number | undefined): void {
        patchState(store, { selectedHouseholdId: householdId });
      },
      setTransactionFilter(filter: TransactionFilter | undefined): void {
        patchState(store, { transactionFilter: filter });
      },
    }))
  );
}
